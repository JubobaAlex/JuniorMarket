import handleLogin from '../model/handleLogin';

describe('handleLogin', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('должен вернуть JWT при успешной авторизации', async () => {
        const mockResponse = {
            access_token: 'test-jwt-token',
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await handleLogin({
            email: 'test@mail.ru',
            password: '123456',
        });

        expect(result).toEqual(mockResponse);
        expect(result.access_token).toBe('test-jwt-token');
    });

    test('должен выбросить ошибку при неудачной авторизации', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({
                message: 'Invalid credentials',
            }),
        });

        await expect(
            handleLogin({
                email: 'test@mail.ru',
                password: 'wrong-password',
            }),
        ).rejects.toThrow('Invalid credentials');
    });
});