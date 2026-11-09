import '../style/AddToCartButton.css'
import { useSelector } from 'react-redux';
import { productInterface } from '@/entities/ProductCard/types/productInterface';
import { RootState } from '@/app/store';
import hadleCreateProductCart from '@/entities/ProductCard/model/handleCreateProductCart';

interface ProductCardProps {
    product:productInterface
}
export default function AddToCartButton({product}:ProductCardProps) {
   
    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    function sendProductData(data:productInterface) {
        const dataObject = {
            "productId": data.id,
            "quantity": 1
        }
        hadleCreateProductCart(dataObject)
    }
    return (
        
        <div>
            {user?.role === 'BUYER' && (
                <button className='product-card-button' onClick={() => sendProductData(product)}>В корзину</button>
            )}
        </div>
    )
}