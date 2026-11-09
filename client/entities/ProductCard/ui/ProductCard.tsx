'use client'
import { productInterface } from "../types/productInterface"
import Link from "next/link"
import '../style/ProductCard.css'
import AddToCartButton from "@/features/add-to-cart/ui/AddToCartButton"
interface ProductCardProps {
    product:productInterface
}
export default function ProductCard({product}:ProductCardProps) {
    return (
        <div className="product-card-container">
            <Link href={`${product.id}/product`}>
            <img src={product.imageUrl} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span>{product.price} ₽</span>
            </Link>
            <AddToCartButton product={product}/>
        </div>
    )
}