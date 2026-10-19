'use client'

import { Product } from "@/widgets/cart-page/types/cartInterface";
import '../style/MyProductCard.css'
import handleDeleteProduct from "@/features/create-product/model/handleDeleteProduct";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MyProductCardProps = {
    product: Product;
};

export default function MyProductCard({ product }: MyProductCardProps) {
    const route = useRouter()

    async function deleteProduct(id:number) {
        await handleDeleteProduct(id)
        route.push('/')    
    }
    return (
        <article className="product-card">
            <div className="product-card-image-wrapper">
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="product-card-image"
                />
            </div>

            <div className="product-card-info">
                <h3 className="product-card-title">{product.title}</h3>

                {product.description && (
                    <p className="product-card-description">{product.description}</p>
                )}

                <div className="product-card-footer">
                    <span className="product-card-price">{product.price} ₽</span>
                    <div className="product-card-actions">
                        <button
                            type="button"
                            className="product-card-edit"
                        >
                            <Link href={`${product.id}/edit`}>Изменить</Link>
                        </button>
                        <button
                            onClick={() => deleteProduct(product.id)}
                            type="button"
                            className="product-card-delete"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}