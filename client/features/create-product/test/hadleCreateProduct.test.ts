import handleCreateProduct from "../model/handleCreateProduct";

describe("handleCreateProduct", () => {
    const productData = {
        title: "iPhone 15",
        imageUrl: "https://example.com/image.jpg",
        description: "Новый iPhone",
        price: 79990,
    };

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("должен успешно создать товар", async () => {
        const product = {
            id: 1,
            ...productData,
            sellerId: 1,
        };

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(product),
        });

        const result = await handleCreateProduct(productData);

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/products`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(productData),
            },
        );

        expect(result).toEqual(product);
    });

    test("должен выбросить ошибку если товар не удалось создать", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({
                message: "Не удалось создать товар",
            }),
        });

        await expect(
            handleCreateProduct(productData),
        ).rejects.toThrow(
            "Не удалось создать товар",
        );
    });

    test("должен использовать стандартное сообщение ошибки, если сервер не вернул message", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValue({}),
        });

        await expect(
            handleCreateProduct(productData),
        ).rejects.toThrow(
            "Не удалось создать товар",
        );
    });
});