import productSearchSlice, {
    setSearch,
    setProducts,
    addProducts,
    setPage,
    setHasMore,
    setLoading,
    setLoadingMore,
    setError,
    clearSearch,
} from '../model/productSearchSlice'
import { productInterface } from '@/entities/ProductCard/types/productInterface';

describe('productSearchSlice', () => {
    const mockProduct: productInterface = {
        id: 1,
        title: 'iPhone 15',
        imageUrl: 'https://example.com/image.jpg',
        description: 'Новый iPhone',
        price: 79990,
        sellerId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    };

    const mockProducts: productInterface[] = [mockProduct];

    describe('reducers', () => {
        test('setSearch должен обновить строку поиска', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setSearch('iPhone');
            const newState = productSearchSlice(initialState, action);

            expect(newState.search).toBe('iPhone');
        });

        test('setProducts должен заменить список товаров', () => {
            const initialState = {
                products: [],
                search: 'test',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setProducts(mockProducts);
            const newState = productSearchSlice(initialState, action);

            expect(newState.products).toEqual(mockProducts);
            expect(newState.products.length).toBe(1);
        });

        test('addProducts должен добавить товары в конец списка', () => {
            const existingProduct: productInterface = {
                id: 1,
                title: 'iPhone 14',
                imageUrl: 'https://example.com/iphone14.jpg',
                description: 'iPhone 14',
                price: 69990,
                sellerId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
            };

            const initialState = {
                products: [existingProduct],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const newProduct: productInterface = {
                id: 2,
                title: 'iPhone 15',
                imageUrl: 'https://example.com/iphone15.jpg',
                description: 'iPhone 15',
                price: 79990,
                sellerId: 1,
                createdAt: '2024-01-02T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
            };

            const action = addProducts([newProduct]);
            const newState = productSearchSlice(initialState, action);

            expect(newState.products).toHaveLength(2);
            expect(newState.products[0]).toEqual(existingProduct);
            expect(newState.products[1]).toEqual(newProduct);
        });

        test('addProducts должен корректно работать с пустым массивом', () => {
            const initialState = {
                products: mockProducts,
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = addProducts([]);
            const newState = productSearchSlice(initialState, action);

            expect(newState.products).toHaveLength(1);
            expect(newState.products).toEqual(mockProducts);
        });

        test('setPage должен обновить номер страницы', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setPage(3);
            const newState = productSearchSlice(initialState, action);

            expect(newState.page).toBe(3);
        });

        test('setHasMore должен обновить флаг hasMore', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setHasMore(false);
            const newState = productSearchSlice(initialState, action);

            expect(newState.hasMore).toBe(false);
        });

        test('setLoading должен обновить флаг isLoading', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setLoading(true);
            const newState = productSearchSlice(initialState, action);

            expect(newState.isLoading).toBe(true);
        });

        test('setLoadingMore должен обновить флаг isLoadingMore', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const action = setLoadingMore(true);
            const newState = productSearchSlice(initialState, action);

            expect(newState.isLoadingMore).toBe(true);
        });

        test('setError должен обновить сообщение об ошибке', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            };

            const errorMessage = 'Ошибка загрузки товаров';
            const action = setError(errorMessage);
            const newState = productSearchSlice(initialState, action);

            expect(newState.error).toBe(errorMessage);
        });

        test('setError должен установить null для сброса ошибки', () => {
            const initialState = {
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: 'Старая ошибка',
            };

            const action = setError(null);
            const newState = productSearchSlice(initialState, action);

            expect(newState.error).toBe(null);
        });

        test('clearSearch должен сбросить всё состояние к начальному', () => {
            const initialState = {
                products: mockProducts,
                search: 'iPhone',
                page: 5,
                hasMore: false,
                isLoading: true,
                isLoadingMore: true,
                error: 'Ошибка',
            };

            const action = clearSearch();
            const newState = productSearchSlice(initialState, action);

            expect(newState).toEqual({
                products: [],
                search: '',
                page: 1,
                hasMore: true,
                isLoading: false,
                isLoadingMore: false,
                error: null,
            });
        });
    });
});