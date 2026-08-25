import handleMe from '../model/handleMe';

describe('handleMe', () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_API_URL =
            'http://localhost:3000';

        global.fetch = jest.fn();

        jest.clearAllMocks();
    });

    test('должен получить текущего пользователя', async () => {
        const mockUser = {
            id: 1,
            email: 'test@test.com',
            role: 'BUYER',
        };

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockUser),
        });

        const result = await handleMe();

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/auth/me',
            {
                credentials: 'include',
            },
        );

        expect(result).toEqual(mockUser);
    });

    test(
        'должен выбросить ошибку при неуспешном запросе',
        async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
            });

            await expect(handleMe()).rejects.toThrow(
                'Пользователь не авторизован',
            );
        },
    );

    test(
        'должен отправлять cookie через credentials include',
        async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({}),
            });

            await handleMe();

            expect(fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    credentials: 'include',
                }),
            );
        },
    );
});