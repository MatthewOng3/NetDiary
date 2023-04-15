import { createSlice, current, createAsyncThunk } from '@reduxjs/toolkit';
import {API_URL} from '../constants/ApiURL'
import axios from 'axios';
import cleanInputData from '../security/CleanInputData'

/*
Category redux state to handle the CRUD operations of category as well as list entries 
*/

//Define axios config options
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};

//Fetch categories relevant to the collection
export const fetchCategories = createAsyncThunk('category/fetchCategories', async (collectionId,{rejectWithValue}) =>{
    try{
        
        //If none found, exit
        if(!collectionId || typeof(collectionId) !== "string"){
            throw "Invalid input"
        }
        
        //Send a get request to express server
        const response = await axios.get(process.env.REACT_APP_API_URL + `categories/get/${collectionId}`, axiosConfig)  
        
        if(!response.data.success){
            throw "No Collection Id Found"
        }

        //Return everything in response.data field
        return response.data.categoryList
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

/*
@description: Add new category
@params collectionId, collectionId from front end in diary page component
*/ 
export const addCategory = createAsyncThunk('category/addCategory', async (collectionId,{rejectWithValue}) => {
    try{
                 
        //If none found, exit
        if(!collectionId || typeof(collectionId) !== "string"){
            throw "Invalid Input"
        }
        
        //Send a get request to express server  
        const response = await axios.post(process.env.REACT_APP_API_URL + 'categories/addCategory', {collectionId: collectionId}, {withCredentials: true})  
        
        if(!response.data.success){
            throw response.data.err
        }

        //Return everything in response.data field
        return response.data //will be payload in addCase
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

/*
@description: Delete Category
@params id_data, id_data  = {collectionId, catId} from category comp
*/
export const deleteCategory = createAsyncThunk('category/deleteCategory', async(id_data,{rejectWithValue}) => {
    try{
        
        const response = await axios.put(process.env.REACT_APP_API_URL + 'categories/deleteCategory', {data: id_data}, axiosConfig)  

        if(!response.data.success){
            throw response.data.err
        }

        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

/*
@description: Update category name
@params data_payload, data_payload = {catId, name, collectionId} from CategoryComp
*/
export const updateCatName = createAsyncThunk('category/updateCatName', async(data_payload,{rejectWithValue}) => {
    try{
         
        const catId = cleanInputData(data_payload.catId)
        const catName = cleanInputData(data_payload.name)
        const collectionId = cleanInputData(data_payload.collectionId)

        if(!catId || !catName || !collectionId || typeof(catId) !== "string" || typeof(catName) !== "string" || typeof(collectionId) !== "string"){
            throw "Invalid Input"
        }
        
        const response = await axios.put(process.env.REACT_APP_API_URL + 'categories/updateCatName', {data: data_payload}, axiosConfig) 
        
        if(!response.data.success){
            throw response.data.err
        }

        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

/*
@description: Save list entry
@params data_payload, data object from EntryModal
*/
export const saveEntry = createAsyncThunk('category/saveEntry', async(data_payload,{rejectWithValue}) => {
    try{
         
        const catId = cleanInputData(data_payload.catId)
        const entryDescription = cleanInputData(data_payload.description)
        const collectionId = cleanInputData(data_payload.collectionId)
        const link  = cleanInputData(data_payload.link)
        

        if(!entryDescription || !link || !collectionId || !catId || typeof(entryDescription) !== "string" || typeof(link) !== "string"){
            throw "Invalid Input"
        }   
         
        const response = await axios.put(process.env.REACT_APP_API_URL + 'categories/saveEntry', {data: data_payload}, axiosConfig)  
        
        if(!response.data.success){
            throw response.data.err
        }

        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

/*
@description: Delete list entry
@params payload from list Entry, payload = {entryId, catId}
*/
export const deleteEntry = createAsyncThunk('category/deleteEntry', async(payload,{rejectWithValue}) => {
    try{
        //Sanitize payload
        const catId = cleanInputData(payload.catId)
        const entryId = cleanInputData(payload.entryId)
        const collectionId = cleanInputData(payload.collectionId)

        if(typeof(catId) !== "string" || typeof(entryId) !== "string" || typeof(collectionId) !== "string"){
            throw "Invalid Input"
        }   
         
        const response = await axios.put(process.env.REACT_APP_API_URL + 'categories/deleteEntry', {data: payload}, axiosConfig)  
        
        if(!response.data.success){
            throw response.data.err
        }

        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {value: [], status: 'idle', error: ""},
    reducers:{
        //this reducer allows other components to force a fetch category from backend  
        forceCategoryFetch: (state, {payload}) => {
            state.status = 'idle'
        },
        //Remove list entry
        removeEntry: (state, {payload}) => {
            const entryId = payload.entryId
            const catId = payload.catId
            //Loop through state to find matching catId
            state.value.forEach((item)=>{
                //If catId match, loop through listEntries property and filter out the entry that corresponds to the payload entryId
                if(item.catId === catId){
                    //Replace with new array
                    item.listEntries = item.listEntries.filter((entry) => {
                        return entry.entryId !== entryId
                    })
                    
                }
            })
        }
    },
    //builder is an object that lets us define additional case reducers that run in response to the actions defined outside of the slice
    extraReducers(builder){
        //execute if async action is pending 
        builder.addCase(fetchCategories.pending, (state,action) => {
            state.status = 'loading'
        })
        //execute if async action is successful
        .addCase(fetchCategories.fulfilled, (state,action) => {
            state.status = 'succeeded'
            state.value = action.payload //Payload receive from the async thunk get request to api
            state.currentCollectionId = action.payload.collectionId //Set current collection Id state
        })
        //execute if async action is rejected
        .addCase(fetchCategories.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        }) 

        //for add category
        builder.addCase(addCategory.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(addCategory.fulfilled, (state,action) => {
            state.status = 'idle'
        })
        .addCase(addCategory.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        })
        

        //deleting category
        builder.addCase(deleteCategory.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(deleteCategory.fulfilled, (state,action) => {
            state.status = 'idle'
        })
        .addCase(deleteCategory.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        })

        //updating category name
        builder.addCase(updateCatName.fulfilled, (state,action) => {
            state.status = 'idle'
        })
        .addCase(updateCatName.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        })

        //Save list entry
        builder.addCase(saveEntry.pending, (state,action) => {
            state.status = 'loading'
        })
        .addCase(saveEntry.fulfilled, (state,action) => {
            state.status = 'idle'
        })
        .addCase(saveEntry.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        })

        //Delete list entry
        builder.addCase(deleteEntry.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(deleteEntry.fulfilled, (state,action) => {
            state.status = 'idle'
        })
        .addCase(deleteEntry.rejected, (state,action) => {
            state.status = 'failed'
            state.error = action.payload.message
        })

    }
})

//Functions to retrieve state values
export const getCategoryStatus = (state) => state.category.status
export const getAllCategory = (state) => state.category.value
export const getCategoryError = (state) => state.category.error
export const getCurrentCollectionId = (state) => state.category.currentCollectionId
 

export const {removeEntry, forceCategoryFetch} = categorySlice.actions;
export default categorySlice.reducer;