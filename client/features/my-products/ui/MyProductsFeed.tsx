'use client'
import '../style/MyProductsFeed.css'
import { useState } from 'react';
import useMyProducts from '../model/useMyProducts';
import MyProductCard from './MyProductCard';
import { Product } from '@/widgets/cart-page/types/cartInterface';
import Modal from '@/shared/Modal/ui/Modal';

export default function MyProductsFeed() {
    const { products, isLoading, error, refetch } = useMyProducts();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(true);

    if (isLoading) {
        return <p style={{ display: 'flex', justifyContent: 'center',margin:'10px'}}>Загрузка товаров...</p>;
    }

    if (error) {
        return (
            <>
                {isErrorModalOpen && (
                    <Modal
                        title="Ошибка загрузки"
                        description={`${error}`}
                        confirmText="Повторить"
                        cancelText="Закрыть"
                        isLoading={isLoading}
                        onConfirm={() => {
                            setIsErrorModalOpen(true)
                            refetch()
                        }}
                        onClose={() => setIsErrorModalOpen(false)}
                    />
                )}
            </>
        );
    }
    if(products.length === 0) {
        return <p style={{ display: 'flex', justifyContent: 'center', margin:'10px'}}>Вы не создали ни одного товара</p>
    }

    return (
        <div className='my-product-feed'>
            {products.map((product: Product) => (
                <MyProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    );
}