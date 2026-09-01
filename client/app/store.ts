import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/model/authSlice';
import productSearchReducer from '@/features/product-search/model/productSearchSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        productSearch:productSearchReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;