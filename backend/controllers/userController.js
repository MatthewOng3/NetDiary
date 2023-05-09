require('dotenv').config();
const User = require('../models/UserModel')
const Token = require('../models/tokenModel')
const ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')
const axios = require("axios");
const { OAuth2Client } = require('google-auth-library');
const crypto = require("crypto")
const Joi = require("joi");

const validate = require('../utils/ValidateUser')
const {hashPassword, comparePasswords} = require('../utils/hashPassword')
const {generateAuthToken, generateRefreshToken} = require('../utils/GenerateAuthToken')
const { generateToken } = require('../utils/GenerateToken');
const {sendEmail} = require('../utils/sendEmail');


/**
 * @desc Register User to web app, creating new data in database
 * @route POST /user/register
 * @access Public 
 * @payload Object containing: username, email, password
 */
const registerUser = async(req, res, next) => {
    try{
        
        //Validate user data being sent from client browser, error, send back status and error message
        const {error} = validate(req.body.user_data)
        
        if(error){ 
            return res.status(400).send({message: error.details[0].message})
        }

        //Retrieve data sent from client side
        const { username, email, password} = req.body.user_data
        const token = req.body.token
       
        //Verify if all inputs exist
        if(!(username && email && password)){
            return res.status(400).send('All inputs are required')
        }
        
        // Sending secret key and response token to Google Recaptcha API for authentication.
        const token_response = await axios.post( `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`);
        
        //Check if user already exists on the database  
        const userExists = await User.findOne({email})
         
        if(userExists !== null){
            return res.status(409).send({message: 'User with given email already exists', success: false, captcha: false});
        }
        else if(!token_response.data.success){
            return res.send({message: 'Invalid Captcha', success: false, captcha: false });
        }
        else{
            // Check response status and send back to the client-side, set toke_sucess to true if successful
             
            
            //Hash user passwords
            const hashedPassword = hashPassword(password)
            const newCollectionId = new ObjectId()
            
            //Create user model and relevant properties
            const newUser = new User({
                username: username, email: email.toLowerCase(), password: hashedPassword, collections: [{name: "First Collection", collectionId: newCollectionId, categoryList: []}]
            });
            
            //Save a new doc into the users collection
            const user = await newUser.save()
            
            //Retrieve newly saved user and generate share token to save into token schema
            const newlySavedUser = await User.findOne({email: email}) 
            
            //Create new token schema and generate the share token
            const shareToken = generateToken()
            const newToken = new Token({userId: newlySavedUser._id, shareToken: shareToken})
  
            //Save new token doc
            const newShareToken = await newToken.save() 
          

            //For email verification
            // const token = await new Token({
            //     userId: user._id,
            //     token: crypto.randomBytes(32).toString("hex")
            // }).save();

            // const url= `${process.env.FRONTEND_URL}api/user/${user._id}/verify/${token.token}`
            // await sendEmailVerification(user.email, "Email Verification for NetDiary", url)

            
            //Send back object to client side saying success
            return res.json({ 
                success: true,
                collectionId: newCollectionId,
                captcha: true,
            })
        }
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', success: false})
        next(err)
    }
}
/**
 * @desc Login user to web app
 * @route POST /user/login
 * @access Public 
 * @payload Object containing: email, password, doNotLogout
 */
const loginUser = async(req, res, next) => {
    try{
        const { email, password} = req.body //doNotLogout comes from frontend
        
        if(!(email && password)){
            return res.status(400).send({message: 'All fields are required'})
        }

        const user = await User.findOne({email}) //Retrieve user from database
        
        //If user exists and passwords match
        if(user && comparePasswords(password, user.password)){
            let collectionId = ""
            //Create new access token for user as well as refresh token
            const {_id, username, email } = user 
            const accessToken = generateAuthToken(_id, username, email)
            const refreshToken = generateRefreshToken(_id, username, email)
            
            //Find user's special share token 
            const shareTokenDoc = await Token.findOne({userId: _id})
            
            //Set collectionId to the first object in collections
            if(user.collections.length > 0){
                collectionId = user.collections[0].collectionId
                //Store current collection id in a cookie
                res.cookie('currentCollectionId', collectionId.toString(), { httpOnly: true, maxAge: 3600000 * 24, secure: false});
            }
            
             
            req.session.user = true
            
            
            
            // Create secure cookie with refresh token 
            // res.cookie('jwt', refreshToken, {
            //     httpOnly: true, //accessible only by web server and not client, put false if you want client to be able to access it 
            //     secure: true, //true if https
            //     sameSite: 'None', //cross-site cookie 
            //     maxAge: 3600000 * 48//cookie expiry: set to match refresh token, 48 hours
            // })
            
            //Store user id in a http only cookie
            res.cookie('user_id', _id.toString(), { httpOnly: true, maxAge: 3600000 * 24, secure: true});
  
            // Send accessToken containing user data and token
            return res.json({ 
                message: 'User Logged In Successfully', 
                user: user,
                auth: true,
                token: accessToken,
                shareToken: shareTokenDoc.shareToken,
                collectionId: collectionId
            })
        }
        else{
            return res.status(401).send({message: 'Invalid credentials', auth: false})
        }
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', auth: false})
        next(err)
    }
}

/**
@description: Login user using google
@route POST /user/google-login
@access Public
*/
const googleLoginUser = async(req, res, next) => {
    const client = new OAuth2Client(process.env.GOOGLE_LOGIN_CLIENT_ID);
    
    try{
        //Retrieve token from frontend
        const jwt_token = req.body.google_token
        
        //Verify google token and client ID with api
        const ticket = await client.verifyIdToken({
            idToken: jwt_token,
            audience: process.env.GOOGLE_LOGIN_CLIENT_ID,
        });
        
        //Payload from google server
        const payload = ticket.getPayload();
        //Extract revelant fields
        const { email, given_name, family_name } = payload;
        
        const user = await User.findOne({email: email.toLowerCase()}) //Retrieve user from database

        let user_id;
        let collectionId;
        //If no user exists create a new one without password field
        if(!user){
            const newCollectionId = new ObjectId()
          
            //Create user doc and relevant properties
            const newUser = new User({
                username: `${given_name} ${family_name}`, email: email.toLowerCase(), collections: [{name: "First Collection", collectionId: newCollectionId, categoryList: []}]
            });
            
            //Save a new doc into the users collection and return the new user
            await newUser.save().then((response)=>{
                const createdUser = response.toObject();
                user_id = createdUser._id
                collectionId = newCollectionId
            }).catch((err)=>console.log(err));
        } 
        else{
            user_id = user._id
            collectionId = user.collectionId
        }
        
        //Create new session
        req.session.ongoingSession = true
        
        //Set google jwt
        res.cookie('google_jwt', jwt_token, { httpOnly: false, maxAge: 3600000 * 24, secure: process.env.NODE_ENV !== "development"})

        //Store user id in a http only cookie
        res.cookie('user_id', user_id, { httpOnly: true, maxAge: 3600000 * 24, secure: process.env.NODE_ENV !== "development"});

        //Store current collection id in a cookie
        res.cookie('currentCollectionId', collectionId.toString(), { httpOnly: true, maxAge: 3600000 * 24, secure: process.env.NODE_ENV !== "development"});

        // Send accessToken containing user data and token
        return res.json({ 
            message: 'User Logged In Successfully', 
            auth: true,
            collectionId: collectionId
        })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error'})
        next(err)
    }
}

/**
 * @description: Verify users email sent from client, used for sending password reset email
 * @route POST /verify-email
 * @access Public
 * @payload Object: email
 */
const verifyUserEmail = async(req, res, next) => {
    try{
        //Validate email
        const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});

		const { error } = emailSchema.validate(req.body);

        //There is an error in validation return error details
		if(error){
            return res.status(400).send({ message: error.details[0].message });
        }

		//Find the user associated with this email
		const user = await User.findOne({ email: req.body.email });
 
		if (!user){
            return res
            .status(409)
            .send({ message: "User with given email does not exist!" });
        }
		
        //Find token schema assocaited with the user using _id
		const token = await Token.findOne({ userId: user._id });
        
        //If no token exists create a new one
		if (!token) {
			token = await new Token({
				userId: user._id,
				shareToken: generateToken(),
			}).save();
		}
        
        //Link that will be sent to users in the email
		const url = `${process.env.FRONTEND_URL}password-reset/${token.shareToken}/`;
       
		const response = await sendEmail(user.email, "Password Reset Link", "d-602360db6ebc4466a850582808683ae5", {reset_link: url});
        
		return res.status(200).send({ message: response.message, auth: response.auth});
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', auth: false})
        next(err)
    }
}

/*
@desc Refresh access token using refresh token
@route GET /auth/refresh
@access Public - because access token has expired
*/
const refresh = (req, res, next) => {
     
    //Check if cookies exist in request
    const cookies = req.cookies
    
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
    const refreshToken = cookies.jwt
    
    //Verify jwt refresh token
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN ,
        //Catch errors
        async function asyncHandler(err, decoded){
            
            if (err) {
                return res.status(403).json({ message: 'Forbidden' })
            }

            //Find user in database
            const foundUser = await User.findOne({ _id: decoded._id }).exec()

            //If no user found return unauthorized
            if (!foundUser) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            //Generate new access token
            const newAccessToken = generateAuthToken(foundUser._id, foundUser.username, foundUser.email)

            res.json({ token: newAccessToken})
        }
    )
    return //Might cause errors
}


/**
 * @desc Logout user and destroy session and delete all cookies and local storage data
 * @route GET /user/logout
 * @access Public 
 */
const logoutUser = async(req, res, next) =>{
    try{
        //Destroy session on server side, not the cookie
        req.session.destroy();
        
        //Check for http only cookie
        const cookies = req.cookies
        
        //If no jwt cookie
        // if (!cookies?.jwt){
        //     return res.status(204) 
        // }
        
        //Remove cookies when logging out
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: process.env.NODE_ENV !== "development" })
        res.clearCookie("user_id") //Remove user_id storage
        res.clearCookie("session") //Remove session cookie
        res.clearCookie("google_jwt") //Remove google sign in jwt token
        res.clearCookie("currentCollectionId") 
 
        return res.send({loggedOut: true, message: 'User logged out'});

    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', loggedOut: false})
        next(err)
    }
}

/*
@desc Verify if user has an ongoing session
@route GET /user/verifySession
@access Public 
*/
const verifyLoggedInUser = async(req, res, next) => {
    try{
        let loggedIn = false;
        
        if(req.cookies.session){
            loggedIn = true
            
        }
       
        return res.send({loggedIn: loggedIn})
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', loggedIn: false})
        next(err)
    }
}

/*
@desc Verify email verification token NOT CURRENTLY USED
@route GET /user/:id/verify/:token
@access Public 
*/
const verifyEmailToken = async(req, res, next) => {
    
    try{
        const user = await User.findOne({_id: req.params.id})

        //If no user found 
        if(!user){
            return res.status(400).send({verified: false, message: "Invalid link"})
        }

        //Search for given token
        const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});

        //If token not found
		if (!token) {
            return res.status(400).send({ message: "Invalid link", verified: false });
        }

		// await User.updateOne({ _id: user._id, verified: true });
        //Remove token once verified
		await token.remove();

		return res.status(200).send({ message: "Email verified successfully", verified: true});
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', verified: false})
        next(err)
    }
}

/**
 * @desc Reset user password by finding user document and updating password field
 * @route POST /user/reset-password
 * @access Public 
 * @payload Object containing _id, newPassword, token
 */
const resetPassword = async(req, res, next) => {
    
    try{
        const token = await Token.findOne({shareToken: req.body.shareToken})

        //If no user found 
        if(!token){
            return res.status(400).send({auth: false, message: "Invalid Token!"})
        }

        //Search for user based on id found in the token table
        const user = await User.findOne({_id: token.userId});

        //If user not found
		if (!user) {
            return res.status(400).send({ message: "No user found", auth: false });
        }

        //Hash user passwords
        const newHashedPassword = hashPassword(req.body.newPassword)
        
        await User.updateOne({_id: user._id}, {$set: {password: newHashedPassword}}).orFail()

		return res.status(200).send({ message: "Password Updated Successfully!", auth: true});
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error', auth: false})
        next(err)
    }
}

module.exports = {registerUser, loginUser, verifyLoggedInUser, logoutUser, refresh, googleLoginUser, verifyEmailToken, verifyUserEmail, resetPassword}
