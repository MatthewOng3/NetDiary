import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import cleanInputData from '../security/CleanInputData'
import CodeError from '../util/CodeError';
import validateURL from '../util/ValidateURL'

/*
Category redux state to handle the CRUD operations of category as well as list entries 
*/
const initialState = { clusters: {}, clusterAdd: false, status: 'idle', error: "" }

/**
 * @description 
 */
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};
/**
 * @description Save cluster list entry to cluster collections
 * @param data_payload data object from EntryModal containing relevant id's and text and link
 * @see ClusterController Server function that handles the 
 */
export const addClusterEntry = createAsyncThunk('cluster/addClusterEntry', async (data_payload, { rejectWithValue }) => {
    try {
        const entryDescription = cleanInputData(data_payload.description)
        const link = cleanInputData(data_payload.link)

        const response = await axios.put(process.env.REACT_APP_API_URL + 'cluster/add-cluster', { data: data_payload }, axiosConfig)
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
        const response = await axios.get(process.env.REACT_APP_API_URL + `cluster/retrieve/${entryId}`, axiosConfig)
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
export const fetchAllClusters = createAsyncThunk('cluster/fetchAllClusters', async (_, { rejectWithValue }) => {
    try {

        const response = await axios.get(process.env.REACT_APP_API_URL + 'cluster/get-clusters', axiosConfig)
        return response.data.clusters
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

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
        builder.addCase(addClusterEntry.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(addClusterEntry.fulfilled, (state, action) => {
                state.status = 'idle'
                state.clusterAdd = false
            })
            .addCase(addClusterEntry.rejected, (state, action) => {
                state.status = 'failed'
                state.clusterAdd = false
                state.error = action.payload.message
            })

        builder.addCase(fetchAllClusters.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(fetchAllClusters.fulfilled, (state, { payload }) => {
                state.status = 'idle'
                const clusters = payload

                //For each cluster object in clusters, map to hashmap
                clusters.reduce((acc, clusterItem) => {
                    acc[clusterItem.clusterId.toString()] = clusterItem.clusterEntries;
                    return acc;
                }, state.clusters);

            })
            .addCase(fetchAllClusters.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })

    }
})


//Functions to retrieve state values
export const getClusterAddState = (state) => state.cluster.clusterAdd
export const getClusterReducerStatus = (state) => state.cluster.status
export const getAllClusters = (state) => state.cluster.clusters

/**
 * @description Retrieves a specific cluster entry list based on clusterId key
 * @param entryId ClusterId key
 * @returns Value that corresponds to Cluster Id Key or null if not exist
 * @see ListEntry
 */
export function selectClusterById(state, entryId) {
    const entryIdKey = entryId.toString()
    return state.cluster.clusters[entryIdKey] || null;
};

export const { updateClusterAdd, resetCluster, fetchCluster } = clusterSlice.actions;
export default clusterSlice.reducer;