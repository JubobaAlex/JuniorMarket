"use client";

import { useEffect, useState } from "react";
import getProducts from "@/entities/ProductCard/api/getProducts";
import { productInterface } from "@/entities/ProductCard/types/productInterface";

export default function useProductFeed() {
    const [products, setProducts] = useState<productInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getProducts({
                    page: 1,
                    limit: 10,
                });

                setProducts(data.products);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Не удалось загрузить товары");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []);

    return {
        products,
        isLoading,
        error,
    };
}