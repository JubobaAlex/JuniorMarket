import { SendProductInterface } from "@/entities/ProductCard/types/SendProductInterface";
async function updateCartItemQuantity(data:SendProductInterface) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${data.productId}`,
                    {
                        method: 'PATCH',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(data),
                    },
                );
            if(!response.ok) {
                    const error = await response.json();
                    throw new Error(JSON.stringify(error));
            }
    }

    catch(errors) {
        console.log(errors)
        throw errors;
    }   
}
export default updateCartItemQuantity