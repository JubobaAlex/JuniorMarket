"use client";

import { useEffect, useRef } from "react";
import ProductCard from "@/entities/ProductCard/ui/ProductCard";
import useProductFeed from "../model/useProductFeed";
import "../style/ProductFeed.css";

export default function ProductFeed() {
    const {
        products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        loadMore,
    } = useProductFeed();

    const observerRef = useRef<IntersectionObserver | null>(
        null,
    );

    const lastProductRef = useRef<HTMLDivElement | null>(
        null,
    );

    useEffect(() => {
        if (isLoading || !hasMore) {
            return;
        }

        if (!lastProductRef.current) {
            return;
        }

        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
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
        return <div style={{display:'flex', justifyContent:'center'}}>Загрузка товаров...</div>;
    }

    if (error && products.length === 0) {
        return <div style={
            {
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                padding: "40px 20px",
                color: "#dc3545"
            }
        }>Ошибка {error}</div>
    }

    if (products.length === 0) {
        return <div style={{display:'flex', justifyContent:'center',alignItems:'center'}}>Товаров пока нет</div>;
    }

    return (
        <>
            <div className="product-feed">
                {products.map((product, index) => {
                    const isLast =
                        index === products.length - 1;

                    if (isLast) {
                        return (
                            <div
                                ref={lastProductRef}
                                key={product.id}
                            >
                                <ProductCard
                                    product={product}
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
                })}
            </div>

            {isLoadingMore && (
                <div >
                    Загрузка следующих товаров...
                </div>
            )}
            {error && (
                <div>
                    Ошибка загрузки: {error}
                </div>
            )}
        </>
    );
}