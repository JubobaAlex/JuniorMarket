import { formDataInterface } from "@/features/create-product/types/formDataInterface"

export default async function handlePatchProduct(
    id: number,
    data: formDataInterface,
): Promise<formDataInterface> {
    const payload = {
        title: data.title,
        imageUrl: data.imageUrl,
        description: data.description,
        price: data.price,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const body = await response.text()
        console.error('PATCH failed:', response.status, body)
        throw new Error(`Не удалось сохранить товар (${response.status})`)
    }

    return response.json()
}