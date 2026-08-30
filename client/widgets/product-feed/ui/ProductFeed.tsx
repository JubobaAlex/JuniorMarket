"use client";

import ProductCard from "@/entities/ProductCard/ui/ProductCard";
import useProductFeed from "../model/useProductFeed";
import '../style/ProductFeed.css'

export default function ProductFeed() {
    const {
        products,
        isLoading,
        error,
    } = useProductFeed();

    if (isLoading) {
        return <div>Загрузка товаров...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (products.length === 0) {
        return <div>Товаров пока нет</div>;
    }

    return (
        <div className="product-feed">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}