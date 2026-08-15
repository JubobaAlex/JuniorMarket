import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authData } from '../types/authData';
interface AuthState {
    user: authData | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<authData>) => {
            state.user = action.payload;
        },

        clearUser: (state) => {
            state.user = null;
        },

        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    setUser,
    clearUser,
    setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;