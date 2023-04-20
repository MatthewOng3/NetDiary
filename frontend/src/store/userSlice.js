import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};

/**
* Verify user session so can log user in right away
*/
export const verifyLoggedIn = createAsyncThunk('user/verifyLoggedIn', async (_,{rejectWithValue}) =>{
    try{
       
        // Check if the user has a valid session here and set the isLoggedIn state accordingly
        const response = await axios.get(process.env.REACT_APP_API_URL + "user/verifySession", axiosConfig)
        
        if(!response.data.loggedIn){
            return rejectWithValue("Failed to verify user session")
        }

        return response.data
    }
    catch(err){
        return rejectWithValue(err.message)
    }
})
 

const userSlice = createSlice({
    name: 'user',
    initialState: { loggedIn: false, status: 'idle', error:"", token: null, shareToken: null },
    reducers:{
        setLoginState: (state,{payload}) => {
            state.loggedIn = payload
        },
        setUserErrorState: (state,{payload}) => {
            state.error = payload
        },
        setShareToken: (state, {payload}) => {
            state.shareToken = payload
        },
        setCredentials: (state, {payload}) => {
            const {accessToken} = payload
            state.token = accessToken
        },
        logout: (state, {payload}) => {
            state.token = null
        }
    },
    extraReducers(builder){
        builder.addCase(verifyLoggedIn.pending, (state, {payload}) =>{
            state.status = 'loading'
        })
        .addCase(verifyLoggedIn.fulfilled, (state, {payload}) => {
            //Logged in status from server is true, set loggedIn redux state to true and success
            if(payload.loggedIn){
                state.loggedIn = true
                state.status = 'success'
            }
        })
        .addCase(verifyLoggedIn.rejected, (state, {payload}) => {
            state.loggedIn = false
            state.status = 'failed'
            state.error = payload.message
        })
    }
})

export const getLoggedInStatus = (state) => state.user.loggedIn
export const getUserStatus = (state) => state.user.status
export const getUserErrorStatus = (state) => state.user.error
export const getShareToken = (state) => state.user.shareToken

export const {setLoginState, updateAllowCookies, setUserErrorState, setCredentials, logout, setShareToken} = userSlice.actions;

export default userSlice.reducer;