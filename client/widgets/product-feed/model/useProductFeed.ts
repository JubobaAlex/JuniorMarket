"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { productInterface } from "@/entities/ProductCard/types/productInterface";
import getProducts from "@/entities/ProductCard/api/getProducts";

export default function useProductFeed(search = "") {
    const [products, setProducts] = useState<productInterface[]>([]);
    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadingRef = useRef(false);
    const pageRef = useRef(1);

    const searchRef = useRef(search);

    useEffect(() => {
        searchRef.current = search;
    }, [search]);

    // Загружаем первую страницу
    // при открытии страницы или изменении поиска
    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            try {
                setIsLoading(true);
                setError(null);

                loadingRef.current = false;
                pageRef.current = 1;
                setPage(1);

                const data = await getProducts({
                    page: 1,
                    limit: 10,
                    search: search.trim() || undefined,
                });

                if (cancelled) {
                    return;
                }

                setProducts(data.products);

                setHasMore(
                    data.pagination.page <
                        data.pagination.totalPages,
                );
            } catch (err) {
                if (cancelled) {
                    return;
                }

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(
                        "Не удалось загрузить товары",
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, [search]);

    // Infinite scroll
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

            const currentSearch =
                searchRef.current.trim();

            console.log(
                "Загрузка страницы:",
                nextPage,
                "Поиск:",
                currentSearch || "нет",
            );

            const data = await getProducts({
                page: nextPage,
                limit: 10,
                search:
                    currentSearch || undefined,
            });

            setProducts((prev) => {
                const existingIds = new Set(
                    prev.map(
                        (product) => product.id,
                    ),
                );

                const newProducts =
                    data.products.filter(
                        (product) =>
                            !existingIds.has(
                                product.id,
                            ),
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
        page,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    };
}