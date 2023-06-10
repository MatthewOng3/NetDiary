require('dotenv').config();
const Cluster = require('../models/ClusterModel')
const ObjectId = require('mongodb').ObjectId

/**
 * @description Fetch all entry of a cluster
 * @route GET /cluster/retrieve/:entryId
 * @param EntryId Id of list entry component
 */
async function fetchCluster(req, res, next) {
    try {

        //Retrieve entryId from frontend
        const entryId = req.params.clusterId

        //If there is no entry id then exit function
        if (!entryId) {
            return res.send({ success: false, clusterEntries: [] })
        }

        //Search database for the corresponding user with the id and retrieve entire categoryList array
        const foundCluster = await Cluster.findOne({ clusterId: entryId }).orFail()

        return res.status(200).json({ clusterEntries: foundCluster ? foundCluster.clusterEntries : [], success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, clusterEntries: [], error: err })
        next(err)
    }
}

/**
 * @description Fetch all entry of a cluster
 * @route GET /cluster/retrieve/:entryId
 * @param EntryId Id of list entry component
 */
async function fetchAllClusters(req, res, next) {
    try {

        //Retrieve userId
        const userId = req.cookies.user_id

        //If there is no entry id then exit function
        if (!userId) {
            return res.send({ success: false, clusters: [] })
        }

        //Search database for the corresponding user with the id and retrieve entire categoryList array
        const foundUser = await Cluster.findOne({ userId: userId })

        return res.status(200).json({ clusters: foundUser ? foundUser.clusters : [], success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, clusterEntries: [], error: err })
        next(err)
    }
}

/**
 * @description Add new entry to a cluster or create a new cluster
 * @route PUT /cluster/get-clusters
 * @param entryId Id of list entry component, will be the clusterId field of cluster document
 * @param userId User id cookie
 */
async function addCluster(req, res, next) {
    try {

        //Retrieve entryId from frontend
        const entryId = ObjectId(req.body.data.entryId)
        const userId = req.cookies.user_id

        //If there is no entry id then exit function
        if (!entryId) {
            return res.send({ success: false })
        }

        //Search database for the corresponding user with the id and retrieve entire categoryList array
        const existingCluster = await Cluster.findOne({ userId: userId })
        //Create new cluster entry object
        const clusterObj = { clusterEntryId: ObjectId(), name: req.body.data.description, link: req.body.data.link }

        //If existing document found
        if (existingCluster) {
            const clusterIndex = existingCluster.clusters.findIndex(cluster => cluster.clusterId === entryId);

            if (clusterIndex !== -1) {
                // If an existing cluster is found with the given entryId, push a new object to clusterEntries
                await Cluster.updateOne(
                    { userId, 'clusters.clusterId': entryId },
                    { $push: { 'clusters.$.clusterEntries': clusterObj } }
                );
            } else {
                // If no cluster is found with the given entryId, push a new cluster with the entryId and the new object to clusterEntries
                await Cluster.updateOne(
                    { userId },
                    { $push: { clusters: { clusterId: entryId, clusterEntries: [clusterObj] } } }
                );
            }
        }
        //Else insert a new document
        else {
            const newCluster = { clusterId: entryId, clusterEntries: [clusterObj] }
            await Cluster.insertMany({ userId: userId, clusters: [newCluster] })
        }

        return res.status(200).json({ success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, error: err })
        next(err)
    }
}


module.exports = { fetchCluster, addCluster, fetchAllClusters }