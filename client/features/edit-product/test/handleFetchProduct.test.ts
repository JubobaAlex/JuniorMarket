import handleFetchProduct from '../model/handleFetchProduct'
import { formDataInterface } from '@/features/create-product/types/formDataInterface'

const API_URL = 'http://localhost:3001'
const PRODUCT_ID = 63

const productFromApi: formDataInterface = {
    title: 'Кружка',
    imageUrl: 'https://example.com/cup.png',
    description: 'Керамическая кружка',
    price: 500,
}

function mockResponse(overrides: Partial<Response> & { json?: () => any; text?: () => any } = {}) {
    return {
        ok: true,
        status: 200,
        json: jest.fn(),
        text: jest.fn(),
        ...overrides,
    } as unknown as Response
}

describe('handleFetchProduct', () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL

    beforeEach(() => {
        process.env.NEXT_PUBLIC_API_URL = API_URL
        global.fetch = jest.fn() as unknown as typeof fetch
    })

    afterEach(() => {
        process.env.NEXT_PUBLIC_API_URL = originalEnv
        jest.restoreAllMocks()
        delete (global as any).fetch
    })

    it('делает GET на правильный URL с credentials и без body', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(productFromApi) })
        )

        await handleFetchProduct(PRODUCT_ID)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [url, init] = (global.fetch as jest.Mock).mock.calls[0]

        expect(url).toBe(`${API_URL}/products/${PRODUCT_ID}`)
        expect(init.credentials).toBe('include')
        // GET: метод по умолчанию, тело и Content-Type не нужны
        expect(init.method).toBeUndefined()
        expect(init.body).toBeUndefined()
        expect(init.headers).toBeUndefined()
    })

    it('возвращает данные товара из ответа', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(productFromApi) })
        )

        const result = await handleFetchProduct(PRODUCT_ID)

        expect(result).toEqual(productFromApi)
    })

    it('возвращает полный объект с сервера (включая id, seller и т.п.) — чистка не его задача', async () => {
        // важно: handleFetchProduct НЕ чистит ответ, это делает компонент
        const fullProduct = {
            ...productFromApi,
            id: PRODUCT_ID,
            sellerId: 1,
            seller: { id: 1, name: 'Иван' },
            createdAt: '2026-01-01',
        }
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(fullProduct) })
        )

        const result = await handleFetchProduct(PRODUCT_ID)

        expect(result).toEqual(fullProduct)
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('seller')
    })

    it('бросает Error со статусом при 404', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                ok: false,
                status: 404,
                text: jest.fn().mockResolvedValue('Not Found'),
            })
        )

        await expect(handleFetchProduct(PRODUCT_ID))
            .rejects.toThrow('Не удалось загрузить товар (404)')
    })

    it('бросает Error со статусом при 401 (нет авторизации)', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                ok: false,
                status: 401,
                text: jest.fn().mockResolvedValue('Unauthorized'),
            })
        )

        await expect(handleFetchProduct(PRODUCT_ID))
            .rejects.toThrow('Не удалось загрузить товар (401)')
    })

    it('пробрасывает сетевую ошибку (fetch rejects)', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'))

        await expect(handleFetchProduct(PRODUCT_ID))
            .rejects.toThrow('Failed to fetch')
    })

    it('бросает ошибку, если ответ ok, но тело не JSON', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token <')),
            })
        )

        await expect(handleFetchProduct(PRODUCT_ID))
            .rejects.toThrow('Unexpected token <')
    })

    it('кодирует id в URL как есть (число → строка)', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(productFromApi) })
        )

        await handleFetchProduct(42)

        const [url] = (global.fetch as jest.Mock).mock.calls[0]
        expect(url).toBe(`${API_URL}/products/42`)
    })
})