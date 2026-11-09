export default async function handleGetProduct(id:number) {
    try {
        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method:'GET',
        })
        if(!response.ok) {
            if(response.status >= 500) {
                throw new Error('Ошибка на стороне сервера')
            }
             throw new Error(`Неизвестная ошибка (${response.status})`)
        }
        return response.json()
    }
    catch(err) {
        if (err instanceof Error) throw err
        throw new Error(String(err))
    }
}