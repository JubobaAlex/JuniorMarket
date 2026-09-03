import deleteCartItem from "../model/deleteCartItem";
global.fetch = jest.fn();

describe("deleteCartItem", () => {
  const productId = 123;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
  });

  test("должен успешно удалить товар из корзины", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await deleteCartItem(productId);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.example.com/cart/items/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
  });

  test("должен выбрасывать ошибку при неудачном ответе API", async () => {
    const errorResponse = { message: "Product not found" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(errorResponse),
    });

    await expect(deleteCartItem(productId)).rejects.toThrow(
      JSON.stringify(errorResponse)
    );
  });

  test("должен обрабатывать сетевые ошибки", async () => {
    const networkError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(deleteCartItem(productId)).rejects.toThrow("Network error");
  });

  test("должен обрабатывать невалидный JSON", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    await expect(deleteCartItem(productId)).rejects.toThrow("Invalid JSON");
  });

  test("должен обрабатывать отсутствие NEXT_PUBLIC_API_URL", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await deleteCartItem(productId);

    expect(global.fetch).toHaveBeenCalledWith(
      `undefined/cart/items/${productId}`,
      expect.any(Object)
    );
  });
});