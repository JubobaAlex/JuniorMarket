async function deleteCartItem(productId:number) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${productId}`, {
            method:'DELETE',
            credentials:'include',
            headers:{
                 'Content-Type': 'application/json',
            }
        });
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

export default deleteCartItem