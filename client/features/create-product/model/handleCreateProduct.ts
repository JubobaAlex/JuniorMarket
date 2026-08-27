import { formDataInterface } from "../types/formDataInterface";

export default async function handleCreateProduct(
    data: formDataInterface,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.message || 'Не удалось создать товар',
        );
    }

    return response.json();
}