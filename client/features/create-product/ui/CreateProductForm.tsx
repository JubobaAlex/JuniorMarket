'use client'

import { RootState } from "@/app/store"
import ErrorPage from "@/widgets/errorPage/ui/ErrorPage";
import { FormEvent, useState } from "react";
import { useSelector } from "react-redux"
import handleCreateProduct from "../model/handleCreateProduct";
import { useRouter } from "next/navigation";
import { formDataInterface } from "../types/formDataInterface";
import "../style/CreateProductForm.css";

export default function CreateProductForm() {
const [formData, setFormData] = useState<formDataInterface>({
title: '',
imageUrl: '',
description: '',
price: 0
});

const [isLoading, setIsLoading] = useState<boolean>(false)
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

    if (formData.title.trim().length === 0) {
        setError('Нету название, добавьте название товара')
        return;
    }
    if (formData.imageUrl.trim().length === 0) {
        setError('Укажите URL картинки вашего товара')
        return;
    }

    if (formData.description.trim().length === 0) {
        setError('Нету описание, добавьте описание товара')
        return;
    }

    if (formData.price <= 0) {
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
    return (
        <ErrorPage
            title="Авторизуйтесь как продавец, чтобы создавать и размещать свои товары"
        />
    )
}

return (
    <div className="create-product">
        <form
            className="create-product__form"
            onSubmit={handleSubmit}
        >
            <h1 className="create-product__title">
                Создание товара
            </h1>

            {error && (
                <div className="create-product__error">
                    Ошибка: {error}
                </div>
            )}

            <div className="create-product__fields">
                <div className="create-product__field">
                    <label
                        className="create-product__label"
                        htmlFor="title"
                    >
                        Название товара
                    </label>

                    <input
                        id="title"
                        className="create-product__input"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        type="text"
                        placeholder="Название"
                        disabled={isLoading}
                    />
                </div>

                <div className="create-product__field">
                    <label
                        className="create-product__label"
                        htmlFor="imageUrl"
                    >
                        URL изображения
                    </label>

                    <input
                        id="imageUrl"
                        className="create-product__input"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        type="text"
                        placeholder="URL картинки"
                        disabled={isLoading}
                    />
                </div>

                <div className="create-product__field">
                    <label
                        className="create-product__label"
                        htmlFor="price"
                    >
                        Цена
                    </label>

                    <input
                        id="price"
                        className="create-product__input"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        placeholder="Цена"
                        disabled={isLoading}
                    />
                </div>

                <div className="create-product__field">
                    <label
                        className="create-product__label"
                        htmlFor="description"
                    >
                        Описание
                    </label>

                    <input
                        id="description"
                        className="create-product__input"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        type="text"
                        placeholder="Описание"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <button
                className="create-product__button"
                disabled={isLoading}
                type="submit"
            >
                {isLoading ? 'Создается...' : 'Создать товар'}
            </button>
        </form>
    </div>
)
}
