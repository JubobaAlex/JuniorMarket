import handleDeleteProduct from "../model/handleDeleteProduct";
describe('handleDeleteProduct', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
        global.fetch = mockFetch;
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    });

    it('должен отправлять DELETE-запрос с правильным URL', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ success: true }),
        });

        await handleDeleteProduct(5);

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/products/5',
            {
                method: 'DELETE',
                credentials: 'include',
            },
        );
    });

    it('должен возвращать данные при успешном удалении', async () => {
        const mockData = { success: true };

        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData),
        });

        const result = await handleDeleteProduct(5);

        expect(result).toEqual(mockData);
    });

    it('должен выбрасывать ошибку, если сервер вернул неуспешный ответ', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
        });

        await expect(handleDeleteProduct(5)).rejects.toBe(
            'Не удалось удалить товар',
        );
    });

    it('должен пробрасывать сетевую ошибку', async () => {
        const networkError = new Error('Network error');

        mockFetch.mockRejectedValue(networkError);

        await expect(handleDeleteProduct(5)).rejects.toBe(networkError);
    });
});