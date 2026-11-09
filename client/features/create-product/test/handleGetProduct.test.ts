import handleGetProduct from "../model/handleGetProduct";

const mockProduct = {
    id: 64,
    title: 'сухарики',
    description: 'хлебобулочным изделиям длительного хранения',
    price: '50',
    imageUrl: 'https://avatars.mds.yandex.net/i?id=769bb4cc0db0119bb71235b29896d1e0_l-4079942-images-thumbs&n=13',
    sellerId: 38,
    seller: {
        id: 38,
        email: 'saskrkr123.com@mail.ru',
        role: 'SELLER',
    },
    createdAt: '2026-10-19T16:31:06.684Z',
    updatedAt: '2026-10-19T16:31:06.684Z',
};

describe('handleGetProduct', () => {
    let mockFetch: jest.Mock;

    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    });

    test('возвращает товар при ok:true', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockProduct),
        });

        await expect(handleGetProduct(64)).resolves.toEqual(mockProduct);
    });

    test('делает запрос на правильный URL', async () => {
    mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProduct),
    });

    await handleGetProduct(64);

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/products/64',
            { method: 'GET' },
        );
});

    test('бросает ошибку при статусе 500', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 500 });

        await expect(handleGetProduct(64)).rejects.toThrow(
            'Ошибка на стороне сервера',
        );
    });

    test('бросает ошибку при статусе 404', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 404 });

        await expect(handleGetProduct(64)).rejects.toThrow(
            'Неизвестная ошибка (404)',
        );
    });

    test('пробрасывает сетевую ошибку', async () => {
        const networkError = new Error('Network failed');
        mockFetch.mockRejectedValue(networkError);

        await expect(handleGetProduct(64)).rejects.toBe(networkError);
    });

    test('оборачивает не-Error в Error', async () => {
        mockFetch.mockRejectedValue('boom');

        await expect(handleGetProduct(64)).rejects.toThrow('boom');
    });
});