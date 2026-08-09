import handleRegister from "../model/handleRegister";
describe('handleLogin', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    test('должен вернуть данные зарегистрированного пользователя', async () => {
    const mockResponse = {
        id: 4,
        email: 'test@mail.ru',
        role: 'BUYER',
        createdAt: '2026-08-08T12:53:40.015Z',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
    });

    const result = await handleRegister({
        email: 'test@mail.ru',
        password: '123456',
        role: 'BUYER',
    });

    expect(result).toEqual(mockResponse);
});
   test('должен выбросить ошибку если пользователь уже существует', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({
            message: 'User already exists',
            error: 'Bad Request',
            statusCode: 400,
        }),
    });

    await expect(
        handleRegister({
            email: 'test@mail.ru',
            password: '123456',
            role: 'BUYER',
        }),
    ).rejects.toThrow('User already exists');
});
});