'use client'
import { productInterface } from "../types/productInterface"
import '../style/ProductCard.css'
import hadleCreateProduct from "../model/hadleCreateProduct"
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
interface ProductCardProps {
    product:productInterface
}
export default function ProductCard({product}:ProductCardProps) {
    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    function sendProductData(data:productInterface) {
        const dataObject = {
            "productId": data.id,
            "quantity": 1
        }
        hadleCreateProduct(dataObject)
    }
    return (
        <div className="product-card-container">
            <img src={product.imageUrl} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span>{product.price} ₽</span>
            {user?.role === 'BUYER' && (
                <button onClick={() => sendProductData(product)}>В корзину</button>
            )}
        </div>
    )
}