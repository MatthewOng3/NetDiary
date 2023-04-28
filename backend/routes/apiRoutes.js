const express = require('express')
const app = express()

//import routes from relevant routes file
const userRoutes = require('./userRoutes')
const collectionRoutes = require('./collectionRoutes')
const categoryRoutes = require('./categoryRoutes')


app.use('/user', userRoutes) 
app.use('/collection', collectionRoutes)
app.use('/categories', categoryRoutes)

module.exports = app