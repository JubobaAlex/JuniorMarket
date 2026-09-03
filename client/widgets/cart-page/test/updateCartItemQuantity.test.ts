import updateCartItemQuantity from "../model/updateCartItemQuantity";
import { SendProductInterface } from "@/entities/ProductCard/types/SendProductInterface";
global.fetch = jest.fn();

describe("updateCartItemQuantity", () => {
  const mockData: SendProductInterface = {
    productId: 123,
    quantity: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
  });

  describe("успешные сценарии", () => {
    test("должен успешно обновить количество товара в корзине", async () => {
      const mockResponse = { success: true, quantity: 5 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await updateCartItemQuantity(mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.example.com/cart/items/${mockData.productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(mockData),
        }
      );
    });

    test("должен обрабатывать обновление с минимальным количеством", async () => {
      const minQuantityData = { ...mockData, quantity: 1 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(minQuantityData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(minQuantityData),
        })
      );
    });

    test("должен обрабатывать обновление с большим количеством", async () => {
      const maxQuantityData = { ...mockData, quantity: 999 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(maxQuantityData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(maxQuantityData),
        })
      );
    });
  });

  describe("обработка ошибок API", () => {
    test("должен выбрасывать ошибку при неудачном ответе API", async () => {
      const errorResponse = { message: "Product not found in cart", status: 404 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        JSON.stringify(errorResponse)
      );
    });

    test("должен обрабатывать ошибку о превышении лимита", async () => {
      const errorResponse = { message: "Maximum quantity limit exceeded", limit: 10 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        JSON.stringify(errorResponse)
      );
    });

    test("должен обрабатывать ошибку о недостаточном количестве на складе", async () => {
      const errorResponse = { message: "Not enough stock available", available: 2 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        JSON.stringify(errorResponse)
      );
    });

    test("должен обрабатывать ошибку аутентификации", async () => {
      const errorResponse = { message: "Unauthorized", status: 401 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        JSON.stringify(errorResponse)
      );
    });
  });

  describe("обработка сетевых ошибок", () => {
    test("должен обрабатывать сетевые ошибки", async () => {
      const networkError = new Error("Network error");
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        "Network error"
      );
    });

    test("должен обрабатывать таймаут запроса", async () => {
      const timeoutError = new Error("Request timeout");
      (global.fetch as jest.Mock).mockRejectedValue(timeoutError);

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        "Request timeout"
      );
    });

    test("должен обрабатывать ошибку DNS", async () => {
      const dnsError = new Error("getaddrinfo ENOTFOUND");
      (global.fetch as jest.Mock).mockRejectedValue(dnsError);

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        "getaddrinfo ENOTFOUND"
      );
    });
  });

  describe("обработка невалидного JSON", () => {
    test("должен обрабатывать невалидный JSON в ошибке ответа", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON in error")),
      });

      await expect(updateCartItemQuantity(mockData)).rejects.toThrow(
        "Invalid JSON in error"
      );
    });
  });

  describe("крайние случаи", () => {
    test("должен обрабатывать отсутствие NEXT_PUBLIC_API_URL", async () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        `undefined/cart/items/${mockData.productId}`,
        expect.any(Object)
      );
    });

    test("должен обрабатывать пустые данные", async () => {
      const emptyData = {} as SendProductInterface;
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(emptyData);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.example.com/cart/items/undefined`,
        expect.objectContaining({
          body: JSON.stringify(emptyData),
        })
      );
    });

    test("должен обрабатывать отрицательное количество", async () => {
      const negativeQuantityData = { ...mockData, quantity: -5 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(negativeQuantityData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(negativeQuantityData),
        })
      );
    });

    test("должен обрабатывать нулевое количество", async () => {
      const zeroQuantityData = { ...mockData, quantity: 0 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(zeroQuantityData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify(zeroQuantityData),
        })
      );
    });

    test("должен сохранять стек ошибок", async () => {
      const errorResponse = { message: "Server error" };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue(errorResponse),
      });

      try {
        await updateCartItemQuantity(mockData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(JSON.stringify(errorResponse));
      }
    });
  });

  describe("проверка метода запроса", () => {
    test("должен использовать метод PATCH", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "PATCH",
        })
      );
    });

    test("должен отправлять заголовки с Content-Type", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    test("должен отправлять credentials: include", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await updateCartItemQuantity(mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: "include",
        })
      );
    });
  });
});