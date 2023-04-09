require('dotenv').config();
const mongoose = require('mongoose')

const connectDB = async () => {
  
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'NetDiaryDB'
        })
        console.log('Connection SUCCESS')
    }
    catch(error){
        console.log('Connection FAIL')
        process.exit(1);
    }
}

module.exports  = connectDB