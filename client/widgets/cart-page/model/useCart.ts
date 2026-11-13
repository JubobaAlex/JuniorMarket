'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { addToCart, removeFromCart, clearCart } from './cartPageSlice'
import updateCartItemQuantity from './updateCartItemQuantity'
import deleteCartItem from './deleteCartItem'
import { CartItem } from '../types/cartInterface'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector((s: RootState) => s.cartPageItem)
  const user = useSelector((s: RootState) => s.auth.user)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  async function fetchCart() {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const raw = await res.text()
      if (!res.ok) throw new Error(raw || `HTTP ${res.status}`)

      dispatch(clearCart())
      if (!raw) return

      const data = JSON.parse(raw)
      const list = Array.isArray(data) ? data : data.items
      list?.forEach((item: CartItem) => dispatch(addToCart(item)))
    } catch (e) {
      console.error(e)
      setError('Ошибка загрузки корзины')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'SELLER') return
    fetchCart()
  }, [user?.role])

  async function changeQuantity(product: CartItem, delta: number) {
    if (updatingId === product.productId) return

    const newQty = product.quantity + delta
    setUpdatingId(product.productId)

    try {
      if (newQty <= 0) {
        await deleteCartItem(product.productId)
        dispatch(removeFromCart(product.productId))
      } else {
        await updateCartItemQuantity({
          productId: product.productId,
          quantity: newQty,
        })
        dispatch(addToCart({ ...product, quantity: newQty }))
      }
    } catch (e) {
      console.error(e)
      setError('Ошибка обновления корзины')
      await fetchCart()
    } finally {
      setUpdatingId(null)
    }
  }

  return {
    items,
    isLoading,
    error,
    updatingId,
    increment: (item: CartItem) => changeQuantity(item, 1),
    decrement: (item: CartItem) => changeQuantity(item, -1),
  }
}