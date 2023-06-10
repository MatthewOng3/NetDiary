const express = require('express');
const router = express.Router()
const { fetchCluster, addCluster, fetchAllClusters } = require('../controllers/clusterController');


//Add cluster entries to entry id
router.put('/add-cluster', addCluster)


//Retrieve cluster based on entry id
router.get('/retrieve/:clusterId', fetchCluster)

//Retrieve all clusters
router.get('/get-clusters', fetchAllClusters)



module.exports = router; 
