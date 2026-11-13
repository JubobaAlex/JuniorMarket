'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { useCart } from '../model/useCart'
import CartTotal from './CartTotal'
import Loading from '@/shared/loading/ui/Loading'
import Modal from '@/shared/Modal/ui/Modal'
import '../style/CartPage.css'

export default function CartPage() {
  const router = useRouter()
  const user = useSelector((s: RootState) => s.auth.user)
  const isSeller = user?.role === 'SELLER'

  const [sellerModalOpen, setSellerModalOpen] = useState(false)
  const { items, isLoading, error, updatingId, increment, decrement } = useCart()

  useEffect(() => {
    if (isSeller) setSellerModalOpen(true)
  }, [isSeller])

  if (isSeller && sellerModalOpen) {
    return (
      <Modal
        title="Ошибка"
        description="К сожалению, корзина доступна только покупателям"
        confirmText="Ок"
        cancelText="Назад"
        onConfirm={() => setSellerModalOpen(false)}
        onClose={() => router.push('/')}
      />
    )
  }

  return (
    <div>
      {isLoading && <Loading centered overlay size={50} />}
      {error && <div className="container-message-cart" style={{ color: 'red' }}>{error}</div>}

      {items.length === 0 && !isLoading ? (
        <div className="container-message-cart">
          <span>Нет добавленных товаров</span>
        </div>
      ) : (
        <div>
          {items.map((item) => {
            const isUpdating = updatingId === item.productId
            return (
              <div className="container-cart-product" key={item.productId}>
                <div className="pre-container-cart-product">
                  <img src={item.product?.imageUrl} alt={item.product?.title} />
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
                    <span>{item.product?.title}</span>
                    <span>Цена: {item.product?.price} ₽</span>
                    <span>{isUpdating ? 'Обновление...' : `Количество: ${item.quantity} шт`}</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <button
                        onClick={() => increment(item)}
                        className="button-buy-product"
                        disabled={isUpdating}
                      />
                      <button
                        onClick={() => decrement(item)}
                        className="button-delete-product"
                        disabled={isUpdating}
                      />
                      <button className="order-btn">Заказать</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CartTotal />
    </div>
  )
}