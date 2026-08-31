"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { productInterface } from "@/entities/ProductCard/types/productInterface";
import getProducts from "@/entities/ProductCard/api/getProducts";

export default function useProductFeed() {
    const [products, setProducts] = useState<productInterface[]>(
        [],
    );

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true)
    const loadingRef = useRef(false)
    const pageRef = useRef(1)

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

                setPage(1);
                pageRef.current = 1;

                setHasMore(
                    data.pagination.page <
                        data.pagination.totalPages,
                );
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(
                        "Не удалось загрузить товары",
                    );
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []);

    const loadMore = useCallback(async () => {
        if (loadingRef.current) {
            return;
        }
        if (!hasMore) {
            return;
        }

        loadingRef.current = true;
        setIsLoadingMore(true);
        setError(null);

        try {
            const nextPage = pageRef.current + 1;

            console.log(
                "Загружаем страницу:",
                nextPage,
            );

            const data = await getProducts({
                page: nextPage,
                limit: 10,
            });

            setProducts((prev) => {
                const existingIds = new Set(
                    prev.map((product) => product.id),
                );

                const newProducts =
                    data.products.filter(
                        (product) =>
                            !existingIds.has(product.id),
                    );

                return [
                    ...prev,
                    ...newProducts,
                ];
            });

            pageRef.current = nextPage;
            setPage(nextPage);

            setHasMore(
                data.pagination.page <
                    data.pagination.totalPages,
            );
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(
                    "Не удалось загрузить следующие товары",
                );
            }
        } finally {
            loadingRef.current = false;
            setIsLoadingMore(false);
        }
    }, [hasMore]);

    return {
        products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    };
}