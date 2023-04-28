const express = require('express')
const router = express.Router()
const {registerUser, loginUser, googleLoginUser, verifyLoggedInUser, logoutUser, refresh, verifyEmailToken, verifyUserEmail} = require("../controllers/userController")



//Route to register user
router.post('/register', registerUser) 

//Verify user email to send password reset link
router.post('/verify-email', verifyUserEmail) 

//Verify email verification token
router.get('/:id/verify/:token', verifyEmailToken)

//Routes to log in  user
router.post('/login', loginUser) 

//Route to log in user using google
router.post('/google-login', googleLoginUser)

//Verify user session
router.get('/verifySession', verifyLoggedInUser)

//Log out user
router.get('/logout',logoutUser);

//Refresh
router.get('/auth/refresh', refresh)


module.exports = router; 