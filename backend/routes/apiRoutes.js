const express = require('express')
const app = express()

//import routes from relevant routes file
const userRoutes = require('./userRoutes')
const collectionRoutes = require('./collectionRoutes')
const categoryRoutes = require('./categoryRoutes')
const clusterRoutes = require('./clusterRoutes')

app.use('/user', userRoutes)
app.use('/collection', collectionRoutes)
app.use('/categories', categoryRoutes)
app.use('/cluster', clusterRoutes)

module.exports = app