"use client";

import {
    useEffect,
    useRef,
} from "react";

import { useSelector } from "react-redux";

import { RootState } from "@/app/store";

import ProductCard from "@/entities/ProductCard/ui/ProductCard";

import useProductFeed from "../model/useProductFeed";

import "../style/ProductFeed.css";

export default function ProductFeed() {
    const search = useSelector(
        (state: RootState) =>
            state.productSearch.search,
    );

    const {
        products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    } = useProductFeed(search);

    const observerRef =
        useRef<IntersectionObserver | null>(
            null,
        );

    const lastProductRef =
        useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!hasMore) {
            return;
        }

        if (!lastProductRef.current) {
            return;
        }

        observerRef.current?.disconnect();

        observerRef.current =
            new IntersectionObserver(
                (entries) => {
                    if (
                        entries[0].isIntersecting &&
                        !isLoadingMore
                    ) {
                        loadMore();
                    }
                },
                {
                    rootMargin: "500px",
                },
            );

        observerRef.current.observe(
            lastProductRef.current,
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, [
        products,
        isLoading,
        hasMore,
        isLoadingMore,
        loadMore,
    ]);

    if (isLoading) {
        return (
            <div className="product-feed-message">
                {search
                    ? "Ищем товары..."
                    : "Загрузка товаров..."}
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="product-feed-message">
                Ошибка: {error}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-feed-message">
                {search
                    ? `По запросу «${search}» ничего не найдено`
                    : "Товаров пока нет"}
            </div>
        );
    }

    return (
        <>
            <div className="product-feed">
                {products.map(
                    (product, index) => {
                        const isLast =
                            index ===
                            products.length - 1;

                        if (isLast) {
                            return (
                                <div
                                    key={product.id}
                                    ref={
                                        lastProductRef
                                    }
                                >
                                    <ProductCard
                                        product={
                                            product
                                        }
                                    />
                                </div>
                            );
                        }

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    },
                )}
            </div>

            {isLoadingMore && (
                <div className="product-feed-message">
                    Загружаем ещё товары...
                </div>
            )}

            {error && products.length > 0 && (
                <div className="product-feed-message">
                    Ошибка загрузки: {error}
                </div>
            )}
        </>
    );
}