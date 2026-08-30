import { productInterface } from "../types/productInterface"
import '../style/ProductCard.css'
interface ProductCardProps {
    product:productInterface
}
export default function ProductCard({product}:ProductCardProps) {
    return (
        <div className="product-card-container">
            <img src={product.imageUrl} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <span>{product.price} ₽</span>
            <button>В корзину</button>
        </div>
    )
}