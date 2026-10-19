import handlePatchProduct from '../model/handlePatchProduct'
import { formDataInterface } from '@/features/create-product/types/formDataInterface'

const API_URL = 'http://localhost:3001'
const PRODUCT_ID = 63

const validData: formDataInterface = {
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

describe('handlePatchProduct', () => {
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

    it('отправляет PATCH на правильный URL с credentials и JSON-заголовком', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(validData) })
        )

        await handlePatchProduct(PRODUCT_ID, validData)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        const [url, init] = (global.fetch as jest.Mock).mock.calls[0]

        expect(url).toBe(`${API_URL}/products/${PRODUCT_ID}`)
        expect(init.method).toBe('PATCH')
        expect(init.credentials).toBe('include')
        expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    })

    it('отправляет только разрешённые поля, отбрасывая лишние (id, seller, createdAt...)', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(validData) })
        )

        const dirtyData = {
            ...validData,
            id: PRODUCT_ID,
            createdAt: '2026-01-01',
            updatedAt: '2026-01-02',
            sellerId: 1,
            seller: { id: 1, name: 'Иван' },
        } as formDataInterface

        await handlePatchProduct(PRODUCT_ID, dirtyData)

        const [, init] = (global.fetch as jest.Mock).mock.calls[0]
        const body = JSON.parse(init.body)

        expect(body).toEqual(validData)
        expect(body).not.toHaveProperty('id')
        expect(body).not.toHaveProperty('createdAt')
        expect(body).not.toHaveProperty('updatedAt')
        expect(body).not.toHaveProperty('sellerId')
        expect(body).not.toHaveProperty('seller')
    })

    it('возвращает распарсенный ответ сервера', async () => {
        const updated = { ...validData, title: 'Кружка обновлённая' }
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({ json: jest.fn().mockResolvedValue(updated) })
        )

        const result = await handlePatchProduct(PRODUCT_ID, validData)

        expect(result).toEqual(updated)
    })

    it('бросает Error со статусом при 400', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                ok: false,
                status: 400,
                text: jest.fn().mockResolvedValue('{"message":["price must be a number"]}'),
            })
        )

        await expect(handlePatchProduct(PRODUCT_ID, validData))
            .rejects.toThrow('Не удалось сохранить товар (400)')

        expect(consoleSpy).toHaveBeenCalledWith(
            'PATCH failed:',
            400,
            '{"message":["price must be a number"]}',
        )
    })

    it('бросает Error со статусом при 500', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                ok: false,
                status: 500,
                text: jest.fn().mockResolvedValue('Internal Server Error'),
            })
        )

        await expect(handlePatchProduct(PRODUCT_ID, validData))
            .rejects.toThrow('Не удалось сохранить товар (500)')
    })

    it('пробрасывает сетевую ошибку (fetch rejects)', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValue(new TypeError('Failed to fetch'))

        await expect(handlePatchProduct(PRODUCT_ID, validData))
            .rejects.toThrow('Failed to fetch')
    })

    it('бросает ошибку, если ответ ok, но тело не JSON', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValue(
            mockResponse({
                json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
            })
        )

        await expect(handlePatchProduct(PRODUCT_ID, validData))
            .rejects.toThrow('Unexpected token')
    })
})