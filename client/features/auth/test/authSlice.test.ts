import authReducer, { setJwt } from '../model/authSlice';

describe('authSlice', () => {
    test('должен сохранить JWT', () => {
        const initialState = {
            jwt: null,
        };

        const action = setJwt('test-jwt-token');

        const state = authReducer(initialState, action);

        expect(state.jwt).toBe('test-jwt-token');
    });
});