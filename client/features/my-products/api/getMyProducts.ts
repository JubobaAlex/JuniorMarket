async function getMyProducts() {
    try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/my`,
        { 
            credentials: 'include' 
        }
    );
    if(!response.ok) {
        throw 'Не удалось загрузить ваши товары'
    }

    return response.json()
    }
    catch(err) {
        throw err
    }
}

export default getMyProducts;