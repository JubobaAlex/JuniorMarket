import { formDataInterface } from "@/features/create-product/types/formDataInterface"

export default async function handleFetchProduct(id: number): Promise<formDataInterface> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        credentials: 'include',
    })
    if (!response.ok) {
        throw new Error(`Не удалось загрузить товар (${response.status})`)
    }
    return response.json()
}