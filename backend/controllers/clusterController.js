require('dotenv').config();
const Cluster = require('../models/ClusterModel')
const ObjectId = require('mongodb').ObjectId

/**
 * @description Fetch all entry of a cluster
 * @route GET /cluster/retrieve/:entryId
 * @param EntryId Id of list entry component
 * @returns The clusterobject corresponding to the clusterId
 */
async function fetchCluster(req, res, next) {
    try {

        //Retrieve entryId from frontend
        const clusterId = req.params.clusterId

        //If there is no entry id then exit function
        if (!clusterId) {
            return res.send({ success: false, clusterEntries: [] })
        }

        //Search database for the corresponding user with the id and retrieve entire categoryList array
        const foundCluster = await Cluster.findOne({ userId: req.cookies.user_id, clusterId: clusterId }).orFail()

        if (foundCluster) {
            const foundClusterObj = foundCluster.clusters.find((item) => {
                return item.clusterId.toString() === clusterId.toString()
            })
            return res.status(200).json({ cluster: foundClusterObj, success: true })
        }


        return res.status(200).json({ cluster: [], success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, cluster: [], error: err })
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
 * @description Add new entry to a cluster or create a new cluster, also handles updating a current cluster entry
 * @route PUT /cluster/save-entry
 * @param {string} entryId Id of list entry component, will be the clusterId field of cluster document
 * @param {ObjectId} userId User id cookie
 */
async function saveClusterEntry(req, res, next) {
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

        //Update cluster list entry
        if (existingCluster && req.body.data.clusterEntryId !== "") {

            await Cluster.updateOne(
                { userId: userId, 'clusters.clusterId': req.body.data.entryId, 'clusters.clusterEntries.clusterEntryId': req.body.data.clusterEntryId },
                {
                    $set: {
                        'clusters.$.clusterEntries.$[entry].name': req.body.data.description,
                        'clusters.$.clusterEntries.$[entry].link': req.body.data.link,
                    },
                },
                {
                    arrayFilters: [{ 'entry.clusterEntryId': req.body.data.clusterEntryId }],
                }
            )

            return res.send({ success: true })
        }

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

/**
 * @description Dlete a specific cluster entry of a cluster
 * @route PUT /cluster/delete-cluster
 * @param EntryId Id of list entry component
 */
async function deleteClusterEntry(req, res, next) {
    try {

        //Retrieve userId
        const userId = req.cookies.user_id
        const clusterId = req.body.data.clusterId
        const clusterEntryId = req.body.data.clusterEntryId

        if (!userId) {
            return res.send({ success: false })
        }

        await Cluster.updateOne({ userId: userId, 'clusters.clusterId': clusterId }, { $pull: { 'clusters.$.clusterEntries': { clusterEntryId } } })

        return res.status(200).json({ clusters: foundUser ? foundUser.clusters : [], success: true })
    }
    catch (err) {
        res.status(500).send({ message: 'Internal Server Error', success: false, clusterEntries: [], error: err })
        next(err)
    }
}



module.exports = { fetchCluster, saveClusterEntry, fetchAllClusters, deleteClusterEntry }