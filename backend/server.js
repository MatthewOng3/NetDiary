/* Import relevant modules*/
require('dotenv').config();
//Set up server and other things
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const session = require('express-session')
const https = require('https');
const fs = require('fs');
const helmet = require("helmet")

/*Set up and use relevant web config options*/

const options = {
  key: fs.readFileSync('../ssl/server.key'),
  cert: fs.readFileSync('../ssl/server.crt')
};

const cors = require('cors');
const corsOptions = {
  origin: 'https://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(helmet())
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })) // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json()) //parses incoming JSON requests and puts the parsed data in req.body

//Initialise session 
app.use(session({
  name: 'session',//name of cookie that is being created and storing session id on client side
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 * 168,
    httpOnly: true,
    secure: false
  }
}))

/* Server connection*/

//Connect to mongodb database
const connectDB = require("./config/db"); //import connect function

connectDB(); //call functin to connect to database
// app.listen(3001)
const port = process.env.PORT || 3000
https.createServer(options, app).listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});


/*Routing*/
const apiRoutes = require('./routes/apiRoutes') //apiRoutes from other file

app.use('/api', apiRoutes) //if url starts with /api, use apiRoutes to handle the request

const path = require('path')
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build"))) //Tells heroku the frontend 
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html")))
}


/* Show error on browser*/
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      message: error.message,
      stack: error.stack
    })
  }
  else {
    res.status(500).json({
      message: error.message
    })
  }
})


