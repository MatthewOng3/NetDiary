const express = require('express');
const { fetchCategories, addCategory, deleteCategory, updateCategoryName, saveEntry, deleteEntry} = require('../controllers/categoryController');
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
 

// router.use(verifyJWT)

//Retrieve categories of the user from database
router.get('/categories/get/:collectionId', fetchCategories)

//Add new category to database
router.post('/categories/addCategory', addCategory)

//Update name of category 
router.put('/categories/updateCatName', updateCategoryName)

//Delete category
router.put('/categories/deleteCategory', deleteCategory)

//Save entry
router.put('/categories/saveEntry', saveEntry)

//Save entry
router.put('/categories/deleteEntry', deleteEntry)

module.exports = router; 
