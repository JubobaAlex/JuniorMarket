'use client'
import '../style/CartTotal.css'
import { useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { useMemo } from "react"
export default function CartTotal() {
    const itemsCart = useSelector((state: RootState) => state.cartPageItem)
    const total = useMemo(() => {
        return itemsCart.reduce((sum , item) => sum += Number((item.product.price) * item.quantity) ,0)
    },[itemsCart])

    return (
        <div className='container-cart-total'>
            <div className='container-cart-total-price'>
                <span>Цена: {total}₽</span>
            </div>
            <div className='container-cart-total-button'>
                <button>Заказать всё</button>
            </div>
        </div>
    )
}