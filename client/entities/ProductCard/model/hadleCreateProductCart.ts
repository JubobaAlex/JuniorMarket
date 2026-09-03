import { SendProductInterface } from "../types/SendProductInterface";
async function hadleCreateProductCart(data:SendProductInterface) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/items`,
                {
                    method: 'POST',
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
            
            return await response.json()
    }

    catch(errors) {
        console.log(errors)
        throw errors;
    }
}
export default hadleCreateProductCart;