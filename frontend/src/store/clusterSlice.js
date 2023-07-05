import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import cleanInputData from '../security/CleanInputData'
import validateURL from '../util/ValidateURL';
import api from '../util/api';

/**
 * @description axios config options
 */
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};

/**
 * @description Save cluster list entry to cluster collections
 * @param {object} data_payload data object from EntryModal containing relevant id's and text and link
 * @see ClusterController Server function that handles the 
 * @see EntryModal Component that calls this async thunk function
 */
export const saveClusterEntry = createAsyncThunk('cluster/saveClusterEntry', async (data_payload, { rejectWithValue }) => {
    try {
        data_payload.description = cleanInputData(data_payload.description)
        data_payload.link = cleanInputData(data_payload.link)

        if (validateURL(data_payload.link)) {
            const response = await api.put('cluster/save-entry', { data: data_payload }, axiosConfig)
            return response.data
        }

        return rejectWithValue("Unsafe Url")
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/**
 * @description Delete cluster entry from a specific cluster
 * @param {object} data_payload data object containing relevant id's and text and link
 * @see ClusterController Server function that handles the 
 */
export const deleteClusterEntry = createAsyncThunk('cluster/deleteClusterEntry', async (data_payload, { rejectWithValue }) => {
    try {
        const response = await api.put('cluster/delete-cluster-entry', { data: data_payload }, axiosConfig)
        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/**
 * @description Save cluster list entry to cluster collections
 * @param data_payload data object from EntryModal containing relevant id's and text and link
 * @see ListEntry
 */
export const fetchClusterEntries = createAsyncThunk('cluster/fetchClusterEntries', async (entryId, { rejectWithValue }) => {
    try {
        const response = await api.get(`cluster/retrieve/${entryId}`, axiosConfig)

        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/**
 * @description Fetch all clusters belonging to user and assign it to their relevant clusters hashmap
 * @param data_payload data object from EntryModal containing relevant id's and text and link
 * @see ListEntry
 */
export const fetchAllClusters = createAsyncThunk('cluster/fetchAllClusters', async (_, { rejectWithValue }) => {
    try {

        const response = await api.get('cluster/get-clusters', axiosConfig)
        return response.data.clusters
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

const initialState = { clusters: {}, clusterIndividualStatus: {}, clusterAdd: false, status: 'idle', error: "" }

const clusterSlice = createSlice({
    name: 'cluster',
    initialState: initialState,
    reducers: {
        updateClusterAdd: (state, { payload }) => {
            state.clusterAdd = payload
        },
        //Reset category state
        resetCluster: (state = initialState, { payload }) => {
            return initialState
        }
    },
    //builder is an object that lets us define additional case reducers that run in response to the actions defined outside of the slice
    extraReducers(builder) {

        //Save list entry
        builder.addCase(saveClusterEntry.pending, (state, action) => {
            state.clusterIndividualStatus[action.meta.arg.entryId.toString()] = 'loading'
        })
            .addCase(saveClusterEntry.fulfilled, (state, { payload }) => {
                state.clusterIndividualStatus[payload.clusterId.toString()] = 'idle'
                state.clusterAdd = false
            })
            .addCase(saveClusterEntry.rejected, (state, { payload }) => {
                state.clusterIndividualStatus[payload.clusterId.toString()] = 'failed'
                state.clusterAdd = false
                state.error = payload.message
            })
        builder.addCase(deleteClusterEntry.pending, (state, action) => {
            state.clusterIndividualStatus[action.meta.arg.clusterId.toString()] = 'loading'
        })
            .addCase(deleteClusterEntry.fulfilled, (state, { payload }) => {
                state.clusterIndividualStatus[payload.clusterId.toString()] = 'idle'
                state.clusterAdd = false
            })
            .addCase(deleteClusterEntry.rejected, (state, action) => {
                state.clusterIndividualStatus[action.meta.arg.clusterId.toString()] = 'failed'
                state.clusterAdd = false
                state.error = action.payload.message
            })
        builder.addCase(fetchAllClusters.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(fetchAllClusters.fulfilled, (state, { payload }) => {
                state.status = 'success'
                const clusters = payload

                //For each cluster object in clusters, map to hashmap
                clusters.reduce((acc, clusterItem) => {
                    acc[clusterItem.clusterId.toString()] = clusterItem.clusterEntries;
                    return acc;
                }, state.clusters);

                //Update each individual status to success
                clusters.reduce((acc, clusterItem) => {
                    acc[clusterItem.clusterId.toString()] = 'success';
                    return acc;
                }, state.clusterIndividualStatus);

            })
            .addCase(fetchAllClusters.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })

        builder.addCase(fetchClusterEntries.pending, (state, action) => {
            state.clusterIndividualStatus[action.meta.arg.toString()] = 'loading'
        })
            .addCase(fetchClusterEntries.fulfilled, (state, { payload }) => {
                //Fetch cluster entries related to a clusterId
                const clusterObj = payload.cluster
                //If there is a cluster obj returned, add it to the clusters hashmap
                if (clusterObj) {
                    state.clusters[clusterObj.clusterId.toString()] = clusterObj.clusterEntries
                }
                state.clusterIndividualStatus[clusterObj.clusterId.toString()] = 'success'
            })
            .addCase(fetchClusterEntries.rejected, (state, action) => {
                state.clusterIndividualStatus[action.meta.arg.toString()] = 'failed'
                state.error = action.payload.message
            })

    }
})


//Functions to retrieve state values
export const getClusterAddState = (state) => state.cluster.clusterAdd
export const getClusterReducerStatus = (state) => state.cluster.status
export const getAllClusters = (state) => state.cluster.clusters

/**
 * Retrieve the status of the cluster related to clusterId from clusterIndividualStatus
 * @param {state} state Redux state of entire app
 * @param {string} clusterId Id of cluster 
 * @returns String indicating which status the cluster is currently at
 */
export function getIndividualClusterStatus(state, clusterId) {
    if (clusterId) {
        return state.cluster.clusterIndividualStatus[clusterId.toString()]
    }
}
/**
* @description Retrieves a specific cluster entry list from cluster slice based on clusterId key
* @param {string} clusterId ClusterId key
* @returns Cluster object that corresponds to Cluster Id Key or null if not exist
* @see ListEntry
*/
export function selectClusterById(state, clusterId) {
    const clusterIdKey = clusterId.toString()
    return state.cluster.clusters[clusterIdKey] || null;
};

/**
 * @description Select a specific cluster entry from a specific cluster
 * @param {clusterState} clusterState Cluster State
 * @param {string} clusterId Cluster Id used to identify the cluster object to retrieve from
 * @param {string} clusterEntryId Cluster Entry Id used to identify the specific entry inside the cluster object array 
 * @returns Cluster Object of form {name, link}
 */
export function selectClusterEntryFromCluster(clusterState, clusterId, clusterEntryId) {
    const clusterIdKey = clusterId.toString()

    const foundCluster = clusterState.clusters[clusterIdKey]
    const foundEntry = foundCluster.find((item) => {
        return item.clusterEntryId === clusterEntryId
    })

    return foundEntry
}

export const { updateClusterAdd, resetCluster, fetchCluster } = clusterSlice.actions;
export default clusterSlice.reducer;