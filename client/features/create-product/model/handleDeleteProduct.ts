export default async function handleDeleteProduct(id:number) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method:'DELETE' ,
            credentials: 'include'
        })
        
        if(!response.ok) {
            throw 'Не удалось удалить товар'
        }
        return response.json()
    }
    catch(err) {
        throw err
    }
}