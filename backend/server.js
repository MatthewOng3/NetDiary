require('dotenv').config();
//Set up server and other things
const express = require('express')
const cookieParser = require('cookie-parser')
 
const app = express()
const session = require('express-session')

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({extended: true})) // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json()) //parses incoming JSON requests and puts the parsed data in req.body

//Initialise session 
app.use(session({
  name: 'session',//name of cookie that is being created and storing session id on client side
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge: 3600000 * 48,
    httpOnly: true,
    secure: false
  }
}))

//import routes from userRoutes file
const userRoutes = require('./routes/userRoutes')
const collectionRoutes = require('./routes/collectionRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
//Connect to mongodb database
const connectDB = require("./config/db"); //import connect function
 
connectDB(); //call functin to connect to database
app.listen(3001)

//Different 
app.use('/api', userRoutes) 
app.use('/api', collectionRoutes)
app.use('/api', categoryRoutes)

//Show error on browser
app.use((error, req, res, next) => {
    if(process.env.NODE_ENV === 'development'){
      res.status(500).json({
        message: error.message,
        stack: error.stack
      })
    }
    else{
      res.status(500).json({
        message: error.message
      })
    }
})
  

