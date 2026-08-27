'use client'

import { RootState } from "@/app/store"
import ErrorPage from "@/widgets/errorPage/ui/ErrorPage";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux"
import handleCreateProduct from "../model/handleCreateProduct";
import { useRouter } from "next/navigation";
import { formDataInterface } from "../types/formDataInterface";

export default function CreateProductForm() {
    const [formData, setFormData] = useState<formDataInterface>({
        title: '',
        imageUrl: '',
        description: '',
        price: 0
    });
    const [isLoading , setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<null | string>(null)
    const user = useSelector((state: RootState) => state.auth.user)
    const router = useRouter()

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        
        if (name === 'price') {
            setFormData({ ...formData, [name]: Number(value) })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null)
        if(formData.title.trim().length === 0) {
            setError('Нету название, добавьте название товара')
            return;
        }
        if(formData.description.trim().length === 0) {
            setError('Нету описание, добавьте описание товара')
            return;
        }
        if(formData.price <= 0) {
            setError('Не указана цена, укажите цену')
            return;
        }
        try {
            setIsLoading(true)
            await handleCreateProduct(formData);

            if (process.env.NODE_ENV === 'development') {
                console.log(
                    'Товар успешно создан:',
                    formData,
                );
            }
            router.push('/')
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('Произошла неизвестная ошибка')
            }
        } finally {
            setIsLoading(false)
        } 
    }

    if (!user || user.role !== 'SELLER') {
        return <ErrorPage title="авторизуйтесь как продавец, чтобы создавать и размещать свои товары" />
    }

    return (
        <div>
            {error && (
                <div>
                    <div>Ошибка ,{error}</div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>Создание товара</div>
                <div>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Название"
                        disabled={isLoading} 
                    />
                    <input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange} 
                        type="text" 
                        placeholder="Url картинки" 
                        disabled={isLoading}
                    />
                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        type="number" 
                        min="0"
                        placeholder="Цена" 
                        disabled={isLoading}
                    />
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Описание" 
                        disabled={isLoading}
                    />
                </div>
                <button disabled={isLoading} type="submit">{isLoading ? 'Создается' : 'Создать'}</button>
            </form>
        </div>
    )
}