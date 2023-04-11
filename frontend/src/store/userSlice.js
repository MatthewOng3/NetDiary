import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};

/**
* Verify user session
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
    initialState: { allowCookies: false, loggedIn: false, status: 'idle' },
    reducers:{
        //Reducer function to update the allow cookies status
        updateAllowCookies: (state,{payload}) => {
            state.allowCookies = payload
        },
        setLoginState: (state,{payload}) => {
            state.loggedIn = payload
            
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
        })
    }
})

export const getLoggedInStatus = (state) => state.user.loggedIn
export const getUserStatus = (state) => state.user.status
export const {setLoginState, updateAllowCookies} = userSlice.actions;

export default userSlice.reducer;