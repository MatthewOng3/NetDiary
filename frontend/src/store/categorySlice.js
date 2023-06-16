import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import cleanInputData from '../security/CleanInputData'
import CodeError from '../util/CodeError';
import validateURL from '../util/ValidateURL'
import api from '../util/api';
/*
Category redux state to handle the CRUD operations of category as well as list entries 
*/
const initialState = { value: [], status: 'idle', error: "" }

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
 * @description Fetch all categories associated with the current collection from backend
 * @route categories/get
 * @response List of categories associated with the collection
 */
export const fetchCategories = createAsyncThunk('category/fetchCategories', async (collectionId, { rejectWithValue }) => {
    try {

        //If incorrect inputs, exit and throw error
        if (!collectionId || typeof (collectionId) !== "string") {
            throw new CodeError("Invalid Input")
        }

        //Send a get request to express server
        const response = await api.get(`categories/get/${collectionId}`, axiosConfig)

        if (!response.data.success) {
            throw new CodeError("No Collection Id Found")
        }

        //Return everything in response.data field
        return response.data.categoryList
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/*
@description: Add new category
@params collectionId, collectionId from front end in diary page component
*/
export const addCategory = createAsyncThunk('category/addCategory', async (collectionId, { rejectWithValue }) => {
    try {

        //If none found, exit
        if (!collectionId || typeof (collectionId) !== "string") {
            throw new CodeError("Invalid Input")
        }

        //Send a get request to express server  
        const response = await api.post('categories/addCategory', { collectionId: collectionId }, { withCredentials: true })

        if (!response.data.success) {
            throw new CodeError(response.data.err)
        }

        //Return everything in response.data field
        return response.data //will be payload in addCase
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/*
@description: Delete Category
@params id_data, id_data  = {collectionId, catId} from category comp
*/
export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id_data, { rejectWithValue }) => {
    try {

        const response = await api.put('categories/deleteCategory', { data: id_data }, axiosConfig)

        if (!response.data.success) {
            throw new CodeError(response.data.err)
        }

        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/*
@description: Update category name
@params data_payload, data_payload = {catId, name, collectionId} from CategoryComp
*/
export const updateCatName = createAsyncThunk('category/updateCatName', async (data_payload, { rejectWithValue }) => {
    try {
        const catId = cleanInputData(data_payload.catId)
        const catName = cleanInputData(data_payload.name)
        const collectionId = cleanInputData(data_payload.collectionId)

        if (!catId || !collectionId || typeof (catId) !== "string" || typeof (catName) !== "string" || typeof (collectionId) !== "string") {
            throw new CodeError("Invalid Input")
        }

        const response = await api.put('categories/updateCatName', { data: data_payload }, axiosConfig)

        if (!response.data.success) {
            throw new CodeError(response.data.err)
        }

        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/**
 * @description Save list entry to database 
 * @param data_payload data object from EntryModal containing relevant id's and text and link
 * @see CategoryController
 */
export const saveEntry = createAsyncThunk('category/saveEntry', async (data_payload, { rejectWithValue }) => {
    try {
        const catId = cleanInputData(data_payload.catId)
        const entryDescription = cleanInputData(data_payload.description)
        const collectionId = cleanInputData(data_payload.collectionId)
        const link = cleanInputData(data_payload.link)


        if (!entryDescription || !link || !collectionId || !catId || typeof (entryDescription) !== "string" || typeof (link) !== "string") {
            throw new CodeError("Invalid Input")
        }

        //Validate URL
        if (!validateURL(link)) {
            return
        }


        const response = await api.put('categories/saveEntry', { data: data_payload }, axiosConfig)


        //If unsuccessful throw error
        if (!response.data.success) {
            throw new CodeError(response.data.err)
        }

        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

/**
 * @description Delete a list entry and the associated cluster
 * @param payload payload = {entryId, catId}
 * @see ListEntry
 */
export const deleteEntry = createAsyncThunk('category/deleteEntry', async (payload, { rejectWithValue }) => {
    try {
        //Sanitize payload
        const catId = cleanInputData(payload.catId)
        const entryId = cleanInputData(payload.entryId)
        const collectionId = cleanInputData(payload.collectionId)

        if (typeof (catId) !== "string" || typeof (entryId) !== "string" || typeof (collectionId) !== "string") {
            return rejectWithValue("Invalid Input")
        }

        const response = await api.put('categories/deleteEntry', { data: payload }, axiosConfig)

        if (!response.data.success) {
            return rejectWithValue(response.data.err)
        }

        return response.data
    }
    catch (err) {
        return rejectWithValue(err.message)
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState: initialState,
    reducers: {
        //this reducer allows other components to force a fetch category from backend  
        forceCategoryFetch: (state, { payload }) => {
            state.status = 'idle'
        },
        setCategoryStateError: (state, { payload }) => {
            state.error = payload
        },
        updateClusterAdd: (state, { payload }) => {
            state.clusterAdd = payload
        },
        //Remove list entry
        removeEntry: (state, { payload }) => {
            const entryId = payload.entryId
            const catId = payload.catId
            //Loop through state to find matching catId
            state.value.forEach((item) => {
                //If catId match, loop through listEntries property and filter out the entry that corresponds to the payload entryId
                if (item.catId === catId) {
                    //Replace with new array
                    item.listEntries = item.listEntries.filter((entry) => {
                        return entry.entryId !== entryId
                    })

                }
            })
        },
        //Reset category state
        resetCategory: (state = initialState, { payload }) => {
            return initialState
        }
    },
    //builder is an object that lets us define additional case reducers that run in response to the actions defined outside of the slice
    extraReducers(builder) {
        //execute if async action is pending 
        builder.addCase(fetchCategories.pending, (state, action) => {
            state.status = 'loading'
        })
            //execute if async action is successful
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.value = action.payload //Payload receive from the async thunk get request to api
                state.currentCollectionId = action.payload.collectionId //Set current collection Id state
            })
            //execute if async action is rejected
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })

        //for add category
        builder.addCase(addCategory.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = 'idle'
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })


        //deleting category
        builder.addCase(deleteCategory.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'idle'
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })

        //updating category name
        builder.addCase(updateCatName.fulfilled, (state, action) => {
            state.status = 'idle'
        })
            .addCase(updateCatName.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.message
            })

        //Save list entry
        builder.addCase(saveEntry.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(saveEntry.fulfilled, (state, action) => {
                state.status = 'idle'
                state.clusterAdd = false
            })
            .addCase(saveEntry.rejected, (state, action) => {
                state.status = 'failed'
                state.clusterAdd = false
                state.error = action.payload.message
            })

        //Delete list entry
        builder.addCase(deleteEntry.pending, (state, action) => {
            state.status = 'loading'
        })
            .addCase(deleteEntry.fulfilled, (state, action) => {
                state.status = 'idle'
            })
            .addCase(deleteEntry.rejected, (state, action) => {
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

/**
 * @description Find specific list entry details based on catId and entryId
 * @param {categoryState} categoryState Category state
 * @param {string} catId catId corresponding to the specific category object
 * @param {string} entryId entryId corresponding to the specific list entry in a category
 * @returns foundEntry object of form {name, link}
 */
export function findListEntry(categoryState, catId, entryId) {

    const categoryList = categoryState.value
    //Find category item that corresponds to catId
    const catItem = categoryList.find((item) => {
        return item.catId === catId.toString()
    })

    //Find list entry if it exists
    const foundEntry = catItem.listEntries.find((item) => {
        return item.entryId === entryId.toString()
    })
    return foundEntry
}

export const { removeEntry, forceCategoryFetch, setCategoryStateError, resetCategory, updateClusterAdd } = categorySlice.actions;
export default categorySlice.reducer;