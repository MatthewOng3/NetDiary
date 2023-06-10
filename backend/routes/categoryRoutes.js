const express = require('express');
const { fetchCategories, addCategory, deleteCategory, updateCategoryName, saveEntry, deleteEntry, getSharedCategory } = require('../controllers/categoryController');

const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")


// router.use(verifyJWT)

//Retrieve categories of the user from database
router.get('/get/:collectionId', fetchCategories)

//Share category
router.get('/shareCategory/:token/:collectionId/:catId', getSharedCategory)

//Add new category to database
router.post('/addCategory', addCategory)

//Update name of category 
router.put('/updateCatName', updateCategoryName)

//Delete category
router.put('/deleteCategory', deleteCategory)

//Save entry
router.put('/saveEntry', saveEntry)

//Save entry
router.put('/deleteEntry', deleteEntry)


module.exports = router; 
