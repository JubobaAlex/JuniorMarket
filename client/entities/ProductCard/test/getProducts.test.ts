import getProducts from "../api/getProducts";

global.fetch = jest.fn();

describe("getProducts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("должен получить товары с параметрами по умолчанию", async () => {
        const mockData = {
            products: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0,
            },
        };

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData),
        });

        const result = await getProducts();

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=10`,
            {
                credentials: "include",
            },
        );

        expect(result).toEqual(mockData);
    });

    test("должен передавать параметры page и limit", async () => {
        const mockData = {
            products: [],
            pagination: {
                total: 20,
                page: 2,
                limit: 10,
                totalPages: 2,
            },
        };

        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockData),
        });

        const result = await getProducts({
            page: 2,
            limit: 10,
        });

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/products?page=2&limit=10`,
            {
                credentials: "include",
            },
        );

        expect(result).toEqual(mockData);
    });

    test("должен передавать search и фильтры цены", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                products: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                },
            }),
        });

        await getProducts({
            page: 1,
            limit: 10,
            search: "доширак",
            minPrice: 100,
            maxPrice: 1000,
        });

        expect(fetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=10&search=%D0%B4%D0%BE%D1%88%D0%B8%D1%80%D0%B0%D0%BA&minPrice=100&maxPrice=1000`,
            {
                credentials: "include",
            },
        );
    });

    test("должен выбросить ошибку если сервер вернул ошибку", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        await expect(
            getProducts({
                page: 1,
                limit: 10,
            }),
        ).rejects.toThrow(
            "Не удалось получить товары",
        );
    });
});
