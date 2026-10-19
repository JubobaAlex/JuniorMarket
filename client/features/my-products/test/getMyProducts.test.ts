import getMyProducts from "../api/getMyProducts";
describe("getMyProducts", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("должен успешно загрузить товары пользователя", async () => {
        const products = [
            {
                id: 1,
                title: "iPhone 15",
                imageUrl: "https://example.com/image.jpg",
                description: "Новый iPhone",
                price: 79990,
                sellerId: 1,
            },
            {
                id: 2,
                title: "Samsung Galaxy S24",
                imageUrl: "https://example.com/image2.jpg",
                description: "Новый Samsung",
                price: 69990,
                sellerId: 1,
            },
        ];

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(products),
        });

        const result = await getMyProducts();

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/products/my`,
            {
                credentials: "include",
            },
        );

        expect(result).toEqual(products);
    });

    test("должен выбросить сетевую ошибку", async () => {
        (fetch as jest.Mock).mockRejectedValue(
            new Error("Network error"),
        );

        await expect(getMyProducts()).rejects.toThrow(
            "Network error",
        );
    });

    test("должен выбросить ошибку при невалидном JSON", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
        });

        await expect(getMyProducts()).rejects.toThrow(
            "Invalid JSON",
        );
    });

    test("должен вернуть пустой массив если товаров нет", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });

        const result = await getMyProducts();

        expect(result).toEqual([]);
    });

    test("должен использовать NEXT_PUBLIC_API_URL в запросе", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([]),
        });

        await getMyProducts();

        expect(fetch).toHaveBeenCalledWith(
            "https://api.example.com/products/my",
            expect.any(Object),
        );
    });
});