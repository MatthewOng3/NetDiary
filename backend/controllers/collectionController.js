require('dotenv').config();
const User = require('../models/UserModel')
const ObjectId = require('mongodb').ObjectId

/*
@description: Retrieve collectionId from httpOnly cookie and send the value to front end
@route GET /collection/get
@access Public
*/
async function retrieveCurrentCollection(req, res, next) {
    try {
        //Retrieve user_id cookie from frontend
        const collectionId = req.cookies.currentCollectionId


        if (!collectionId) {
            return res.json({ success: false })
        }
        return res.send({ collectionId: collectionId, success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, error: err })
        next(err)
    }
}

/*
@description: Fetch all collections of the user from the database
@route GET /collection/get
@access Public
*/
async function fetchCollections(req, res, next) {
    try {
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        //Search database for the corresponding user with the id
        const user = await User.findOne({ _id: ObjectId(userId) })

        return res.send({ collections: user.collections, success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, error: err })
        next(err)
    }
}

/*
@description: Add new collection to database
@route PUT /collection/add
@access Public
*/
async function addCollection(req, res, next) {
    try {
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        //New Collection being pushed to collections array 
        const newCollection = {
            name: "",
            collectionId: new ObjectId(),
            categoryList: []
        }

        //Search database for the corresponding user with the id
        const user = await User.updateOne({ _id: ObjectId(userId) }, { $push: { collections: newCollection } }).orFail()

        //Return error if user not found
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //Update cookie value
        res.cookie('currentCollectionId', newCollection.collectionId.toString(), { httpOnly: true, maxAge: 3600000 * 24, secure: true });

        return res.status(200).json({ success: true, collectionId: newCollection.collectionId });
    }
    catch (err) {
        res.send({ message: "Internal Server Error", success: false, error: err })
        next(err) //pass the error to the next middleware function in the Express application's middleware chain.
    }
}

/*
@description: Update collection name
@route PUT /collection/updateName
@access Public
*/
async function updateCollectionName(req, res, next) {
    try {
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id
        const newName = req.body.name
        const collectionId = req.body.collectionId

        //Search database for the corresponding user with the id, and update name of collection
        //The $ symbol in the string 'collections.$.name' is a special operator that identifies the index of the matched array element for an update operation.
        const user = await User.updateOne({ _id: ObjectId(userId), 'collections.collectionId': collectionId }, { $set: { 'collections.$.name': newName } }).orFail()

        //Return error if user not found
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ success: true, value: newName, collectionId: collectionId });
    }
    catch (err) {
        res.send({ message: "Internal Server Error", success: false, error: err })
        next(err) //pass the error to the next middleware function in the Express application's middleware chain.
    }
}

/*
@description: Delete collection
@route PUT /collection/delete
@access Public
*/
async function deleteCollection(req, res, next) {

    try {
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        const collectionId = ObjectId(req.body.data)

        //Search database for the corresponding user with the id, and pull the element from the collections array, identifying by collectionId  
        const user = await User.updateOne({ _id: ObjectId(userId) }, { $pull: { collections: { collectionId: collectionId } } })

        // //Return error if user not found
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // //Send the collection id of the next collection object
        const userDoc = await User.findOne({ _id: ObjectId(userId) }, { collections: { $slice: -1 } }).orFail()
        let newCollectionId = "";

        //If there is still a collection left then update accordingly
        if (userDoc.collections.length > 0) {
            newCollectionId = userDoc.collections[0].collectionId;
        }

        //Update cookie value
        res.cookie('currentCollectionId', newCollectionId.toString(), { httpOnly: true, maxAge: 3600000 * 24, secure: true });

        res.status(200).json({ success: true, collectionId: newCollectionId });
    }
    catch (err) {
        res.send({ message: "Internal Server Error", success: false, error: err })
        next(err) //pass the error to the next middleware function in the Express application's middleware chain.
    }

}


module.exports = { fetchCollections, addCollection, updateCollectionName, deleteCollection, retrieveCurrentCollection }