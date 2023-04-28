const express = require('express')
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const {fetchCollections, addCollection, updateCollectionName, deleteCollection, retrieveCurrentCollection} = require("../controllers/collectionController")

//router.use(verifyJWT)

//Retrieve collections of the user from database
router.get('/get',fetchCollections)

//Retrieve currentCollectionid of user in cookie and send to client side
router.get('/retrieveCollectionId', retrieveCurrentCollection)

//Add collection of the user 
router.put('/add',addCollection)

//Update collection name
router.put('/updateName',updateCollectionName)

//Delete collection
router.put('/delete', deleteCollection)

module.exports = router; 