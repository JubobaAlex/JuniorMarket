'use client'

import { RootState } from "@/app/store"
import ErrorPage from "@/widgets/errorPage/ui/ErrorPage";
import { useSelector } from "react-redux"


export default function CreateProductForm() {
    const user = useSelector((state:RootState) => state.auth.user);

    return (
        <div>
            {user && user.role === 'SELLER' ? (
                <div>
                    <div>
                        <div>Создание товара</div>
                        <div>
                            <input type="text" placeholder="Название" />
                            <input type="text" placeholder="Url картинки" />
                            <input type="number" placeholder="Цена" />
                            <input type="text" placeholder="Описание" />
                        </div>
                        
                    </div>
                </div>
            ) : (
                <ErrorPage title = 'авторизуйтесь как продавец ,чтобы создавать и размещать свои товары'/>
            )}
        </div>
    )
}