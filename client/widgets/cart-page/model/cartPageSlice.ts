import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = [];

const cartpageslice = createSlice({
    name: 'cartPageItem',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingItem = state.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                existingItem.quantity = action.payload.quantity;
            } else {
                state.push(action.payload);
            }
        },
        removeFromCart(state, action) {
            return state.filter(item => item.productId !== action.payload);
        },
        clearCart(state) {
            return [];
        }
    }
})

export default cartpageslice.reducer
export const { addToCart, removeFromCart, clearCart } = cartpageslice.actions