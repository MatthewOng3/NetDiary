const mongoose = require('mongoose')
 
const categorySchema = mongoose.Schema({
    catId: {type: mongoose.Schema.Types.ObjectId, unique: true, sparse:true},
    name: {type: String },
    listEntries: [
        {
            entryId: {type: mongoose.Schema.Types.ObjectId, unique:true, sparse:true},
            name: {type: String },
            link: {type: String },
        }
    ]
}, {_id: false, timestamps: false})

const collectionSchema = mongoose.Schema({
    name: {type: String},
    collectionId: {type: mongoose.Schema.Types.ObjectId, unique: true, sparse:true,}, 
    categoryList: [categorySchema]
},  { _id : false, timestamps: true })

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    },
    collections:[
       collectionSchema
    ],
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports =  User