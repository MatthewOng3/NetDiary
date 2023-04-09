const jwt = require('jsonwebtoken')

/*
@description: Verify current token of user, so call this method when making requests to api backend to authenticate them
@route POST /user/register
@access Private
*/
const verifyJWT = async(req, res, next) =>{
    try{
        //Retrieve token from client
        // const token = req.headers["x-access-token"]
         
        // const token =  req.headers["authorization"];
        const authHeader = req.headers.authorization || req.headers.Authorization
        const token = authHeader.split(' ')[1]

        //If no token
        if(!token){
            return res.status(401).send({message: "Unauthorized"})
        }

        console.log(token)
        //Verify token if no errors
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err,decoded) => {
           
            if(err){
                return res.status(403).json({auth: false, message: "Forbidden"})
            }
            console.log(decoded)
            req.user_id = decoded._id
            next() 
        })
    }
    catch(err){
        res.status(500).send({message: 'Internal Server Error'})
        next(err)
    }
}

module.exports = verifyJWT