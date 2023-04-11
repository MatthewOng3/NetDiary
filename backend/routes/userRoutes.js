const express = require('express')
const router = express.Router()
const {registerUser, loginUser, googleLoginUser, verifyLoggedInUser, logoutUser, refresh} = require("../controllers/userController")


 
//Route to register user
router.post('/user/register', registerUser) 

//Routes to log in  user
router.post('/user/login', loginUser) 

//Route to log in user using google
router.post('/user/google-login', googleLoginUser)
router.get('/user/verifySession', verifyLoggedInUser)

//Log out user
router.get('/user/logout',logoutUser);

//Refresh
router.get('/auth/refresh', refresh)


module.exports = router; 