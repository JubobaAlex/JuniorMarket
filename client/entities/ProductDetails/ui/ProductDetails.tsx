'use client'

import { useParams, useRouter } from 'next/navigation'
import '../style/ProductDetails.css'
import { useEffect, useState } from 'react'
import handleGetProduct from '@/features/create-product/model/handleGetProduct'
import AddToCartButton from '@/features/add-to-cart/ui/AddToCartButton'
import { productInterface } from '@/entities/ProductCard/types/productInterface'
import Modal from '@/shared/Modal/ui/Modal'

export default function ProductDetails() {
    const params = useParams()
    const [product, setProduct] = useState<productInterface | null>(null)
    const [isLoading , setIsLoading] = useState<boolean>(true)
    const [error , setError] = useState<Error | null>(null)
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(true)
    const router = useRouter()

    function closeErrorModal() {
    setIsErrorModalOpen(false)
    }

    function goHome() {
        router.push('/')
    }

    useEffect(() => {
        async function fetchProduct() {
        try {
            const result = await handleGetProduct(Number(params.id))
            setProduct(result)
            console.log(result)
        } catch(err) {
             setError(err instanceof Error ? err : new Error(String(err)))
        }
        finally {
            setIsLoading(false)
        }
    }
    fetchProduct()
},[params.id])
    
    if(isLoading) return <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>Загрузка...</div>
    if(error !== null && isErrorModalOpen) return <Modal title='Ошибка' description={error.message} confirmText='Ок' cancelText='Назад' onClose={goHome} onConfirm={closeErrorModal} />
    if (!product) {
        return <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}} className='container-product-cart'>Товар не найден</div>
    }
    return (
        <div className='container-product-cart'>
            <div className='pre-container-product-cart'>
                <div className='container-product-cart-image'>
                    <img src={product.imageUrl} alt={product.title} />
                </div>

                <div className='container-product-cart-information'>
                    <h2>Товар №{product.id}</h2>
                    <p>Название: {product.title}</p>
                    <p>Описание: {product.description}</p>
                    <span>Стоимость: {product.price} ₽</span>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    )
}