require('dotenv').config();
const User = require('../models/UserModel')
const ObjectId = require('mongodb').ObjectId

/*
@description: Fetch all categories
@route GET /categories/get
@access Public
*/
async function fetchCategories(req, res, next){
    try{
         
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id
        let collectionId = req.params.collectionId

        //If there is nothing in params meaning its after a new redux state, so retrieve from cookies instead
        if(!collectionId){
            collectionId = req.cookies.currentCollectionId
        }
   
        //If still no collectionId exists
        if(!collectionId){
            return res.json({success: false})
        }

        //Search database for the corresponding user with the id and retrieve entire categoryList array
        const foundCollection = await User.findOne({_id: ObjectId(userId), 'collections.collectionId': collectionId}, {_id: 0, 'collections.$': 1}).orFail()  

        //Return just the category list
        const categoryList = foundCollection.collections[0].categoryList
        
        return res.status(200).json({collectionId: collectionId, categoryList: categoryList, success: true})
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}

/*
@description: Add new category to database
@route POST /categories/addCat
@access Public
*/
async function addCategory(req, res, next){
     
    try{
        
        // //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id
        const collectionId = req.body.collectionId
        
        //Create new category object
        const newCat = {catId: new ObjectId(), name: "", listEntries: []}
         
        //Search database for the corresponding user with the id
        await User.updateOne({_id: ObjectId(userId), 'collections.collectionId': ObjectId(collectionId)}, {$push: { 'collections.$.categoryList': newCat}}, { new: true}).orFail()
        
        return res.status(200).json({collectionId: collectionId, success: true})
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}

/*
@description: Delete category from database
@route PUT categories/deleteCategory
@access Public
*/
async function deleteCategory(req, res, next){
    try{
        
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id
        const collectionId = req.body.data.collectionId
        const catId = req.body.data.catId
        
        /*Delete category in the respective collection id, first query identifes the collection object to delete from, second part  lets you identify which cat Id to pull from 
        The $ positional operator in MongoDB is used to identify the array element that matches the query criteria in the filter of the update operation.*/
        const categoryList = await User.updateOne({_id: ObjectId(userId), 'collections.collectionId': ObjectId(collectionId)}, 
        {$pull: { 'collections.$.categoryList': { "catId": ObjectId(catId)}}}, { new: true}).orFail()
        
        return res.status(200).json({ success: true })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}

/*
@description: Update the name of a specific category object in cateogry list array of a specific collection object
@route PUT categories/updateCatName
@access Public
*/
async function updateCategoryName(req, res, next){
    try{
        
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        const collectionId = req.body.data.collectionId
        const catId = req.body.data.catId
        const newName = req.body.data.name
         
        //Perform query to update the name of a specific category object in cateogry list array 
        await User.updateOne({_id: ObjectId(userId)}, 
        {  $set: { 'collections.$[collection].categoryList.$[category].name': newName }}, 
        { arrayFilters: [{ 'collection.collectionId': ObjectId(collectionId) }, { 'category.catId': ObjectId(catId) }], new: true }) .orFail()

        return res.status(200).json({ success: true })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}

/*
@description: Save Entry of webpage or update it 
@route PUT categories/saveEntry
@access Public
*/
async function saveEntry(req, res, next){
    try{
        
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        const collectionId = req.body.data.collectionId
        const catId = req.body.data.catId
        const entryId = req.body.data.entryId
        const description = req.body.data.description
        const link = req.body.data.link

        //Create new list entry object
        const newEntry ={
            entryId: new ObjectId(),
            name: description,
            link: link
        }
        
        //If no entry id present meaning its a new entry so push to listEntries array, else update the already existing entry
        if(!entryId){
            await User.updateOne({_id: ObjectId(userId)}, 
            {  $push: { 'collections.$[collection].categoryList.$[category].listEntries': newEntry }}, 
            { arrayFilters: [{ 'collection.collectionId': ObjectId(collectionId) }, { 'category.catId': ObjectId(catId) }], new: true }).orFail()
        }
        else{
            await User.updateOne({_id: ObjectId(userId)}, 
            {  $set: { 
                'collections.$[collection].categoryList.$[category].listEntries.$[entry].name': description,
                'collections.$[collection].categoryList.$[category].listEntries.$[entry].link': link,
            }}, 
            { arrayFilters: [{ 'collection.collectionId': ObjectId(collectionId) }, { 'category.catId': ObjectId(catId) }, { 'entry.entryId': ObjectId(entryId) }], new: true }).orFail() 
        }
        
        return res.status(200).json({ success: true })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}

/*
@description: Delete an entry of a webpage
@route PUT categories/deleteEntry
@access Public
*/
async function deleteEntry(req, res, next){
    try{
        
        //Retrieve user_id cookie from frontend
        const userId = req.cookies.user_id

        const collectionId = req.body.data.collectionId
        const catId = req.body.data.catId
        const entryId = req.body.data.entryId

        //Perform query of deleting the list entry
        await User.updateOne({_id: ObjectId(userId)}, 
            {  $pull: { 'collections.$[collection].categoryList.$[category].listEntries': { "entryId": ObjectId(entryId)}}}, 
            { arrayFilters: [{ 'collection.collectionId': ObjectId(collectionId) }, { 'category.catId': ObjectId(catId) }], new: true }).orFail() 
        
        
        return res.status(200).json({ success: true })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false, error: err})
        next(err)
    }
}


module.exports = {fetchCategories, addCategory, deleteCategory, updateCategoryName, saveEntry, deleteEntry}