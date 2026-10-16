'use client'
import { useCallback, useEffect, useState } from 'react';
import getMyProducts from '../api/getMyProducts';

export default function useMyProducts() {
const [products, setProducts] = useState([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

const fetchProducts = useCallback( async () => {
    setIsLoading(true)
    setError(null);
        try {
            const data = await getMyProducts();
            setProducts(data);
        } catch(err) {
            setError(typeof err === 'string' ? err : '');
        } finally {
            setIsLoading(false);
        }
}, []);

useEffect(() => {
    fetchProducts()
},[fetchProducts])


return {
    products,
    isLoading,
    error,
    refetch:fetchProducts
};
}