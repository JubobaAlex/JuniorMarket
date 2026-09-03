
export interface Product {
    id: number;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    sellerId: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    cartId: number;
    productId: number;
    product: Product;
}

export interface Cart {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    items: CartItem[];
}