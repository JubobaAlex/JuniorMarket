import cartpageslice, { addToCart, removeFromCart, clearCart } from "../model/cartPageSlice"

describe("cartpageslice", () => {
  const mockProduct = {
    productId: 1,
    name: "Тестовый товар",
    price: 100,
    quantity: 2,
  };

  const mockProduct2 = {
    productId: 2,
    name: "Другой товар",
    price: 200,
    quantity: 1,
  };

  describe("addToCart", () => {
    test("должен добавить новый товар в корзину", () => {
      const initialState: any[] = [];
      const newState = cartpageslice(initialState, addToCart(mockProduct));

      expect(newState).toHaveLength(1);
      expect(newState[0]).toEqual(mockProduct);
    });

    test("должен обновить количество существующего товара", () => {
      const initialState = [mockProduct];
      const updatedProduct = { ...mockProduct, quantity: 5 };
      const newState = cartpageslice(initialState, addToCart(updatedProduct));

      expect(newState).toHaveLength(1);
      expect(newState[0].quantity).toBe(5);
    });

    test("должен добавить несколько разных товаров", () => {
      const initialState: any[] = [];
      let state = cartpageslice(initialState, addToCart(mockProduct));
      state = cartpageslice(state, addToCart(mockProduct2));

      expect(state).toHaveLength(2);
      expect(state[0]).toEqual(mockProduct);
      expect(state[1]).toEqual(mockProduct2);
    });

    test("должен обновлять только количество, не меняя другие поля", () => {
      const initialState = [mockProduct];
      const updatedProduct = { ...mockProduct, quantity: 3 };
      const newState = cartpageslice(initialState, addToCart(updatedProduct));

      expect(newState[0].productId).toBe(mockProduct.productId);
      expect(newState[0].name).toBe(mockProduct.name);
      expect(newState[0].price).toBe(mockProduct.price);
      expect(newState[0].quantity).toBe(3);
    });
  });

  describe("removeFromCart", () => {
    test("должен удалить товар из корзины по ID", () => {
      const initialState = [mockProduct, mockProduct2];
      const newState = cartpageslice(initialState, removeFromCart(1));

      expect(newState).toHaveLength(1);
      expect(newState[0]).toEqual(mockProduct2);
    });

    test("должен вернуть пустой массив при удалении единственного товара", () => {
      const initialState = [mockProduct];
      const newState = cartpageslice(initialState, removeFromCart(1));

      expect(newState).toHaveLength(0);
      expect(newState).toEqual([]);
    });

    test("не должен изменять состояние при удалении несуществующего ID", () => {
      const initialState = [mockProduct];
      const newState = cartpageslice(initialState, removeFromCart(999));

      expect(newState).toHaveLength(1);
      expect(newState).toEqual(initialState);
    });

    test("должен удалить правильный товар при совпадении ID", () => {
      const initialState = [
        { ...mockProduct, productId: 1 },
        { ...mockProduct2, productId: 1 },
      ];
      const newState = cartpageslice(initialState, removeFromCart(1));

      expect(newState).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    test("должен очистить всю корзину", () => {
      const initialState = [mockProduct, mockProduct2, mockProduct];
      const newState = cartpageslice(initialState, clearCart());

      expect(newState).toHaveLength(0);
      expect(newState).toEqual([]);
    });

    test("должен вернуть пустой массив если корзина уже пуста", () => {
      const initialState: any[] = [];
      const newState = cartpageslice(initialState, clearCart());

      expect(newState).toHaveLength(0);
      expect(newState).toEqual([]);
    });
  });

  describe("начальное состояние", () => {
    test("должен иметь начальное состояние в виде пустого массива", () => {
      const initialState = cartpageslice(undefined, { type: "unknown" });
      expect(initialState).toEqual([]);
    });
  });

  describe("комплексные сценарии", () => {
    test("должен корректно обрабатывать последовательность действий", () => {
      let state: any[] = [];
      state = cartpageslice(state, addToCart(mockProduct));
      state = cartpageslice(state, addToCart(mockProduct2));
      expect(state).toHaveLength(2);
      const updatedProduct = { ...mockProduct, quantity: 10 };
      state = cartpageslice(state, addToCart(updatedProduct));
      expect(state).toHaveLength(2);
      expect(state[0].quantity).toBe(10);
      state = cartpageslice(state, removeFromCart(2));
      expect(state).toHaveLength(1);
      expect(state[0].productId).toBe(1);

      state = cartpageslice(state, clearCart());
      expect(state).toHaveLength(0);
    });
  });
});