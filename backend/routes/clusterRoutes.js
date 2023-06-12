const express = require('express');
const router = express.Router()
const { fetchCluster, saveClusterEntry, fetchAllClusters, deleteClusterEntry } = require('../controllers/clusterController');


//Add cluster entries to entry id
router.put('/save-entry', saveClusterEntry)


//Retrieve cluster based on entry id
router.get('/retrieve/:clusterId', fetchCluster)

//Retrieve all clusters
router.get('/get-clusters', fetchAllClusters)

//Delete a cluter entry 
router.put('/delete-cluster-entry', deleteClusterEntry)


module.exports = router; 
