import { createSlice } from '@reduxjs/toolkit';
 
const userSlice = createSlice({
    name: 'user',
    initialState: { allowCookies: false },
    reducers:{
        //Reducer function to update the allow cookies status
        updateAllowCookies: (state,{payload}) => {
            state.allowCookies = payload
        }
    }
})

export default userSlice.reducer;