import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API_URL} from '../constants/ApiURL'
import cleanInputData from '../security/CleanInputData'
import axios from 'axios';

/*
Collection redux state to handle the CRUD operations of collections
*/

//Define axios config options
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    credentials: "include"
};


/**
 * Fetch collection from backend using get request
 */
export const fetchCollections = createAsyncThunk('collection/fetchCollections', async (_,{rejectWithValue}) =>{
    try{
        //Send a get request to express server
        const response = await axios.get(process.env.REACT_APP_API_URL + 'collection/get', axiosConfig) //NEED WITH CREDENTIALS TO SEND COOKIE
        
        if(!response.data.success){
            throw response.data.err
        }
      
        //Return everything in response.data field
        return response.data.collections //will be payload in reducers
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

//Async function to add collection list of collections
export const addCollection = createAsyncThunk('collection/addCollectionApi', async(_, {rejectWithValue}) => {
    try{
        
        //Send a get request to express server
        const response = await axios.put(process.env.REACT_APP_API_URL + 'collection/add',{}, {withCredentials: true}) //newCollection can be accessed by req.body
        
        if(!response.data.success){
            throw response.data.err
        }
       
        //Return everything in response.data field, DONT FORGET TO RETURN res.json() THE SAME OBJECT IN YOUR MIDDLEWARE
        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

//Async function to update collection name
export const updateCollectionName = createAsyncThunk('collection/updateCollectionName', async({name, collectionId}, {rejectWithValue}) => {
    try{
        //Validate input
        if(!name || !collectionId || typeof(name) !== "string" || typeof(collectionId) !== "string"){
            throw "Invalid Input"
        }

        //Sanitize input data before sending it to server side
        const newName = cleanInputData(name)
        const currentCollectionId = cleanInputData(collectionId)

        //Send a get request to express server
        const response = await axios.put(process.env.REACT_APP_API_URL + 'collection/updateName', {name: newName, collectionId: currentCollectionId}, axiosConfig) //newCollection can be accessed by req.body
        
        if(!response.data.success){
            throw response.data.err
        }

        //Return everything in response.data field 
        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

//Async function to delete collection
export const deleteCollection = createAsyncThunk('collection/deleteCollection', async(collectionId, {rejectWithValue}) => {
    try{
        //Validate input
        if(!collectionId || typeof(collectionId) !== "string"){
            throw "Invalid Input"
        }
        
        //Send a get request to express server
        const response = await axios.put(process.env.REACT_APP_API_URL + `collection/delete`, {data: collectionId}, axiosConfig) //need data field if using delete
    
        if(!response.data.success){
            throw response.data.err
        }
       
        //Return everything in response.data field 
        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

const collectionSlice = createSlice({
    name: 'collection',
    initialState: {value: [],status: 'idle', currentCollection: "",error: null},
    reducers:{
        updateCurrentCollection: (state, {payload}) => {
            state.currentCollection = payload
        },
    },
    //builder is an object that lets us define additional case reducers that run in response to the actions defined outside of the slice
    extraReducers(builder){
        //execute if async action is pending 
        builder.addCase(fetchCollections.pending, (state,action) => {
            state.status = 'loading'
        })
        //execute if async action is successful
        .addCase(fetchCollections.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.value = [...action.payload] //Payload receive from the async thunk get request to api
        })
        //execute if async action is rejected
        .addCase(fetchCollections.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })

        //Add new collection
        builder.addCase(addCollection.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(addCollection.fulfilled, (state, action) => {
            //Set current collection state to new collectionId
            state.currentCollection = action.payload.collectionId
            //Set status to idle so in sidedrawer the use effect will call fetchCollections to fetch from database
            state.status = 'idle'
        })
        .addCase(addCollection.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })

        //Update Collection Name
        builder.addCase(updateCollectionName.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(updateCollectionName.fulfilled, (state, action) => {
            state.status = 'idle'
        })
        .addCase(updateCollectionName.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })

        //Delete collection
        builder.addCase(deleteCollection.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(deleteCollection.fulfilled, (state, action) => {
            state.currentCollection = action.payload.collectionId
            state.status = 'idle'
        })
        .addCase(deleteCollection.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload
        })
    }
})

//To be called in side drawer file in useSelector to retrieve the different states
export const getCollectionsStatus = (state) => state.collection.status
export const getAllCollections = (state) => state.collection.value
export const getCollectionsError = (state) => state.collection.error
export const getCollectionsLength = (state) => state.collection.value.length

export const {updateCurrentCollection} = collectionSlice.actions;
export default collectionSlice.reducer;