'use client'

import { RootState } from "@/app/store"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart, clearCart } from "../model/cartPageSlice"
import updateCartItemQuantity from "../model/updateCartItemQuantity"
import '../style/CartPage.css'
import deleteCartItem from "../model/deleteCartItem"

export default function CartPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorState, setErrorState] = useState<null | string>(null)
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
    const dispatch = useDispatch()
    const itemsCart = useSelector((state: RootState) => state.cartPageItem)

    const getCartItems = useCallback(async () => {
        try {
            setErrorState(null)
            setIsLoading(true)
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(JSON.stringify(error));
            }
            
            const data = await response.json();
            
            dispatch(clearCart())
            
            if (data && data.items && Array.isArray(data.items)) {
                data.items.forEach((item: any) => {
                    dispatch(addToCart(item));
                });
            } 
            else if (Array.isArray(data)) {
                data.forEach((item: any) => {
                    dispatch(addToCart(item));
                });
            } 
            else {
                console.warn('Неизвестная структура:', data);
                setErrorState('Неизвестная структура данных');
            }
            
        } catch(errors) {
            console.error('Ошибка:', errors);
            setErrorState('Ошибка загрузки корзины');
        } finally {
            setIsLoading(false);
        }
    },[dispatch])
    
    useEffect(() => {
        getCartItems()
    }, [])
    
    async function addQuantityProduct(product: any) {
        const productId = product.productId;
        
        if (updatingItemId === productId) return;
        setUpdatingItemId(productId);
        
        try {
            const newQuantity = product.quantity + 1;
            const data = {
                productId: productId,
                quantity: newQuantity
            }
            
            await updateCartItemQuantity(data);
            
            const updatedProduct = {
                ...product,
                quantity: newQuantity
            };
            dispatch(addToCart(updatedProduct));
            
        } catch(error) {
            console.error('Ошибка при добавлении товара:', error);
            setErrorState('Ошибка обновления количества');
            await getCartItems();
        } finally {
            setUpdatingItemId(null);
        }
    }

    async function deleteQuantityProduct(product: any) {
        const productId = product.productId;
        const newQuantity = product.quantity - 1;
        
        if (updatingItemId === productId) return;
        setUpdatingItemId(productId);
        
        try {
            if (newQuantity <= 0) {
                await deleteCartItem(productId);
                dispatch(removeFromCart(productId))
            } else {
                const data = {
                    productId: productId,
                    quantity: newQuantity
                }
                await updateCartItemQuantity(data);
                
                const updatedProduct = {
                    ...product,
                    quantity: newQuantity
                };
                dispatch(addToCart(updatedProduct));
            }
        } catch(error) {
            console.error('Ошибка при удалении товара:', error);
            setErrorState('Ошибка обновления корзины');
            await getCartItems();
        } finally {
            setUpdatingItemId(null);
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column'}}>
            {isLoading && <div className="container-message-cart">Загрузка...</div>}
            {errorState && <div className="container-message-cart" style={{ color: 'red' }}>{errorState}</div>}
            {itemsCart.length === 0 && !isLoading ?  (
                <div className="container-message-cart">
                    <span>Нету добавленных товаров</span>
                </div>
            ) : (
                <div>
                    {itemsCart.map((item) => {
                        const isUpdating = updatingItemId === item.productId;
                        
                        return (
                            <div className="container-cart-product" key={item.productId}>
                                <div className="pre-container-cart-product">
                                    <img src={item.product.imageUrl} alt={item.product?.title} />
                                    <div style={{display:'flex',flexDirection:'column',marginLeft:'15px'}}>
                                        <span>{item.product?.title}</span>
                                        <span>Цена: {item.product.price} ₽</span>
                                        
                                        <span>
                                            {isUpdating ? 'Обновление...' : `Количество: ${item.quantity} шт`}
                                        </span>
                                        
                                        <div style={{display:'flex',gap:'20px'}}>
                                            <button 
                                                onClick={() => addQuantityProduct(item)} 
                                                className="button-buy-product"
                                                disabled={isUpdating}
                                            >
                                            </button>
                                            <button 
                                                onClick={() => deleteQuantityProduct(item)} 
                                                className="button-delete-product"
                                                disabled={isUpdating}
                                            >
                                            </button>
                                            <button className="order-btn">Заказать</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}