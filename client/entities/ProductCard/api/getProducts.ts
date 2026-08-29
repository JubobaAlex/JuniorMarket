import { productInterface } from "../types/productInterface";
interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface ProductsResponse {
    products: productInterface[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default async function getProducts({
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
}: GetProductsParams = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search) {
        params.set("search", search);
    }

    if (minPrice !== undefined) {
        params.set("minPrice", String(minPrice));
    }

    if (maxPrice !== undefined) {
        params.set("maxPrice", String(maxPrice));
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
        {
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error("Не удалось получить товары");
    }

    return response.json();
}