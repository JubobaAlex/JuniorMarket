import handleDelete from "../model/handleDelete";

describe('handleDelete', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('должен вернуть null при успешном удалении (204)', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 204,
        });

        const result = await handleDelete();

        expect(result).toBeNull();
    });

    test('должен вернуть json при успешном удалении с телом ответа', async () => {
        const mockResponse = { message: 'Аккаунт удалён' };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });

        const result = await handleDelete();

        expect(result).toEqual(mockResponse);
    });

    test('должен выбросить ошибку при неудачном удалении', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
        });

        await expect(handleDelete()).rejects.toThrow(
            'Не удалось удалить аккаунт',
        );
    });

    test('должен вызвать fetch с правильными параметрами', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            status: 204,
        });

        await handleDelete();

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/users/delete',
            {
                method: 'DELETE',
                credentials: 'include',
            },
        );
    });
});