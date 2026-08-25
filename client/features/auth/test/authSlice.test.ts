import authReducer, { setUser, setAuthLoading, clearUser } from "../model/authSlice";
import { authData } from "../types/authData";

const mockUser: authData = {
    email: 'test@mail.ru',
    password: 'test',
    role: 'BUYER',
};

describe('тестируем setUser', () => {
    test('вернет правильный экшен с пользователем в payload', () => {
        const action = setUser(mockUser);
        expect(action).toEqual({
            type: 'auth/setUser',
            payload: mockUser,
        });
    });
    
    test('должен установить пользователя в состояние', () => {
        const initialState = {
            user: null,
            isLoading: true,
        };
        const action = setUser(mockUser);
        const newState = authReducer(initialState, action);

        expect(newState.user).toEqual(mockUser);
        expect(newState.isLoading).toBe(true);
    });
});

describe('тестируем clearUser', () => { 
    test('вернет правильный экшен без payload', () => {
        const action = clearUser();
        
        expect(action).toEqual({
            type: 'auth/clearUser',
        });
        // Проверяем, что payload не определен
        expect(action.payload).toBeUndefined(); // ✅ Исправлено
    });
    
    test('должен очистить пользователя из состояния', () => {
        const initialState = {
            user: mockUser,
            isLoading: false,
        };
        const action = clearUser();
        const newState = authReducer(initialState, action);
        
        expect(newState.user).toBeNull();
        expect(newState.isLoading).toBe(false);
    });
    
    test('должен работать даже если пользователя нет', () => {
        const initialState = {
            user: null,
            isLoading: true,
        };
        
        const action = clearUser();
        const newState = authReducer(initialState, action);
        
        expect(newState.user).toBeNull();
        expect(newState.isLoading).toBe(true);
    });
});

describe('тестируем setAuthLoading', () => {
    test('вернет правильный экшен с булевым значением', () => {
        const action = setAuthLoading(false);
        
        expect(action).toEqual({
            type: 'auth/setAuthLoading',
            payload: false,
        });
    });

    test('должен установить isLoading в false', () => {
        const initialState = {
            user: null,
            isLoading: true,
        };
        
        const action = setAuthLoading(false);
        const newState = authReducer(initialState, action);
        
        expect(newState.isLoading).toBe(false);
        expect(newState.user).toBeNull();
    });

    test('должен установить isLoading в true', () => {
        const initialState = {
            user: mockUser,
            isLoading: false,
        };
        
        const action = setAuthLoading(true);
        const newState = authReducer(initialState, action);
        
        expect(newState.isLoading).toBe(true);
        expect(newState.user).toEqual(mockUser);
    });
});

describe('тестируем все экшены вместе', () => {
    test('полный цикл работы с пользователем', () => {
        let state = authReducer(undefined, { type: 'unknown' });
        expect(state).toEqual({
            user: null,
            isLoading: true,
        });
        
        state = authReducer(state, setUser(mockUser));
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(true);
        
        state = authReducer(state, setAuthLoading(false));
        expect(state.isLoading).toBe(false);
        expect(state.user).toEqual(mockUser);
        
        state = authReducer(state, clearUser());
        expect(state.user).toBeNull();
        expect(state.isLoading).toBe(false);
        
        state = authReducer(state, setAuthLoading(true));
        expect(state.isLoading).toBe(true);
        expect(state.user).toBeNull();
    });
});