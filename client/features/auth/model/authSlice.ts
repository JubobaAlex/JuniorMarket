import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState:{
        jwt: null as string | null
    },
    reducers:{
        setJwt:(state , action:PayloadAction<string>) => {
            state.jwt = action.payload
        }
    }
})

export const { setJwt } = authSlice.actions;

export default authSlice.reducer;