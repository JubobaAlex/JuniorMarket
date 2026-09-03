import hadleCreateProductCart from "../model/hadleCreateProductCart";
import { SendProductInterface } from "../types/SendProductInterface";
global.fetch = jest.fn();

describe("hadleCreateProductCart", () => {
  const mockData: SendProductInterface = {
    productId: 123,
    quantity: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
  });

  test("должен успешно создать продукт в корзине", async () => {
    const mockResponse = { success: true, cartId: "cart123" };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    const result = await hadleCreateProductCart(mockData);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(mockData),
      }
    );
    expect(result).toEqual(mockResponse);
  });

  test("должен обрабатывать ошибку ответа API", async () => {
    const errorResponse = { message: "Product not found", status: 404 };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(errorResponse),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    await expect(hadleCreateProductCart(mockData)).rejects.toThrow(
      JSON.stringify(errorResponse)
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/cart/items",
      expect.any(Object)
    );
  });

  test("должен обрабатывать сетевые ошибки", async () => {
    const networkError = new Error("Network error");
    const mockFetch = jest.fn().mockRejectedValue(networkError);
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    await expect(hadleCreateProductCart(mockData)).rejects.toThrow(
      "Network error"
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/cart/items",
      expect.any(Object)
    );
  });

  test("должен обрабатывать пустые данные", async () => {
    const emptyData = {} as SendProductInterface;
    const mockResponse = { success: true };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    const result = await hadleCreateProductCart(emptyData);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/cart/items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(emptyData),
      }
    );
    expect(result).toEqual(mockResponse);
  });

  test("должен обрабатывать отсутствие NEXT_PUBLIC_API_URL", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    await hadleCreateProductCart(mockData);

    expect(mockFetch).toHaveBeenCalledWith(
      "undefined/cart/items",
      expect.any(Object)
    );
  });

  test("должен обрабатывать невалидный JSON в ответе", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    await expect(hadleCreateProductCart(mockData)).rejects.toThrow(
      "Invalid JSON"
    );
  });

  test("должен обрабатывать невалидный JSON в ошибке ответа", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON in error")),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    await expect(hadleCreateProductCart(mockData)).rejects.toThrow(
      "Invalid JSON in error"
    );
  });

  test("должен сохранять стек ошибок", async () => {
    const errorResponse = { message: "Server error" };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(errorResponse),
    });
    (global.fetch as jest.Mock).mockImplementation(mockFetch);

    try {
      await hadleCreateProductCart(mockData);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(JSON.stringify(errorResponse));
    }
  });
});