import {handleLogout } from "../model/handleLogout";

global.fetch = jest.fn();

const mockDispatch = jest.fn();

describe('тестируем handleLogout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('должен успешно выполнить logout при успешном ответе', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await expect(handleLogout(mockDispatch)).resolves.toBeUndefined();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
            }
        );
    });

    test('должен выбросить ошибку если response.ok = false', async () => {
        const errorMessage = 'Ошибка выхода';
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                message: errorMessage,
            }),
        });

        await expect(handleLogout(mockDispatch)).rejects.toThrow(errorMessage);
        
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('должен использовать стандартное сообщение если error.message отсутствует', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({}),
        });

        await expect(handleLogout(mockDispatch)).rejects.toThrow('Ошибка выхода из аккаунта');
        
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('должен выбросить ошибку если fetch упал с сетевой ошибкой', async () => {
        const networkError = new Error('Network error');
        (fetch as jest.Mock).mockRejectedValueOnce(networkError);

        await expect(handleLogout(mockDispatch)).rejects.toThrow(networkError);
        
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('должен использовать правильный URL из переменных окружения', async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(fetch).toHaveBeenCalledWith(
            `${apiUrl}/auth/logout`,
            expect.any(Object)
        );
    });

    test('должен использовать правильные credentials', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                credentials: 'include',
            })
        );
    });

    test('должен использовать метод POST', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: 'POST',
            })
        );
    });
});

describe('тестируем handleLogout с разными сценариями ошибок', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('должен обработать ошибку с кодом 401', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValueOnce({
                message: 'Сессия истекла',
            }),
        });

        await expect(handleLogout(mockDispatch)).rejects.toThrow('Сессия истекла');
    });

    test('должен обработать ошибку с кодом 500', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({
                message: 'Внутренняя ошибка сервера',
            }),
        });

        await expect(handleLogout(mockDispatch)).rejects.toThrow('Внутренняя ошибка сервера');
    });

    test('должен обработать ошибку если json вернул не объект', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce('string error'),
        });

        await expect(handleLogout(mockDispatch)).rejects.toThrow('Ошибка выхода из аккаунта');
    });
});

describe('тестируем handleLogout с environment variables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    test('должен работать если NEXT_PUBLIC_API_URL не определен', async () => {
        delete process.env.NEXT_PUBLIC_API_URL;
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(fetch).toHaveBeenCalledWith(
            'undefined/auth/logout',
            expect.any(Object)
        );
    });

    test('должен использовать переменную окружения правильно', async () => {
        process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(fetch).toHaveBeenCalledWith(
            'https://api.example.com/auth/logout',
            expect.any(Object)
        );
    });
});

describe('тестируем вызовы dispatch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('должен вызвать setAuthLoading(true) в начале', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
            type: 'auth/setAuthLoading',
            payload: true,
        }));
    });

    test('должен вызвать clearUser() после успешного запроса', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(mockDispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
            type: 'auth/clearUser',
        }));
    });

    test('должен вызвать setAuthLoading(false) в конце', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
        });

        await handleLogout(mockDispatch);

        expect(mockDispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
            type: 'auth/setAuthLoading',
            payload: false,
        }));
    });

    test('должен вызвать setAuthLoading(false) при ошибке', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        try {
            await handleLogout(mockDispatch);
        } catch (error) {
            // ignore
        }

        expect(mockDispatch).toHaveBeenLastCalledWith(expect.objectContaining({
            type: 'auth/setAuthLoading',
            payload: false,
        }));
    });
});