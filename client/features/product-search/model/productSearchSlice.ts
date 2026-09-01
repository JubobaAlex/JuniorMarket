import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productInterface } from '@/entities/ProductCard/types/productInterface';

interface ProductSearchState {
    products: productInterface[];
    search: string;
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
}

const initialState: ProductSearchState = {
    products: [],
    search: '',
    page: 1,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,
};

const productSearchSlice = createSlice({
    name: 'productSearch',

    initialState,

    reducers: {
        setSearch(
            state,
            action: PayloadAction<string>,
        ) {
            state.search = action.payload;
        },

        setProducts(
            state,
            action: PayloadAction<productInterface[]>,
        ) {
            state.products = action.payload;
        },

        addProducts(
            state,
            action: PayloadAction<productInterface[]>,
        ) {
            state.products.push(...action.payload);
        },

        setPage(
            state,
            action: PayloadAction<number>,
        ) {
            state.page = action.payload;
        },

        setHasMore(
            state,
            action: PayloadAction<boolean>,
        ) {
            state.hasMore = action.payload;
        },

        setLoading(
            state,
            action: PayloadAction<boolean>,
        ) {
            state.isLoading = action.payload;
        },

        setLoadingMore(
            state,
            action: PayloadAction<boolean>,
        ) {
            state.isLoadingMore = action.payload;
        },

        setError(
            state,
            action: PayloadAction<string | null>,
        ) {
            state.error = action.payload;
        },

        clearSearch(state) {
            state.products = [];
            state.search = '';
            state.page = 1;
            state.hasMore = true;
            state.isLoading = false;
            state.isLoadingMore = false;
            state.error = null;
        },
    },
});

export const {
    setSearch,
    setProducts,
    addProducts,
    setPage,
    setHasMore,
    setLoading,
    setLoadingMore,
    setError,
    clearSearch,
} = productSearchSlice.actions;

export default productSearchSlice.reducer;