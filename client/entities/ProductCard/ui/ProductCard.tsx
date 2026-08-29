import { productInterface } from "../types/productInterface"

interface ProductCardProps {
    product:productInterface
}
export default function ProductCard({product}:ProductCardProps) {
    return (
        <div key={product.id}>
            <img src={product.imageUrl} alt="" />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span>{product.price} ₽</span>
        </div>
    )
}