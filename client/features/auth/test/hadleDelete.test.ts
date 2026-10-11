import handleDelete from '../model/handleDelete';

describe('handleDelete', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('должен вернуть данные при успешном удалении', async () => {
        const mockResponse = { message: 'Аккаунт удалён' };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await handleDelete();

        expect(result).toEqual(mockResponse);
        expect(result.message).toBe('Аккаунт удалён');
    });

    test('должен выбросить ошибку с message из ответа при неудачном удалении', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ message: 'Пользователь не найден' }),
        });

        await expect(handleDelete()).rejects.toThrow('Пользователь не найден');
    });

    test('должен выбросить дефолтную ошибку, если message отсутствует', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(handleDelete()).rejects.toThrow(
            'Не удалось удалить аккаунт',
        );
    });

    test('должен выбросить дефолтную ошибку, если json() падает', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => {
                throw new Error('Invalid JSON');
            },
        });

        await expect(handleDelete()).rejects.toThrow(
            'Не удалось удалить аккаунт',
        );
    });

    test('должен вернуть null при успешном ответе без тела', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => {
                throw new Error('No content');
            },
        });

        const result = await handleDelete();

        expect(result).toBeNull();
    });

    test('должен вызвать fetch с правильными параметрами', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        await handleDelete();

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/auth/delete',
            {
                method: 'DELETE',
                credentials: 'include',
            },
        );
    });
});