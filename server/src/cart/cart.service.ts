import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async addToCart(
        userId: number,
        dto: AddToCartDto,
    ) {
        const product =
            await this.prisma.product.findUnique({
                where: {
                    id: dto.productId,
                },
            });

        if (!product) {
            throw new NotFoundException(
                'Товар не найден',
            );
        }

        let cart =
            await this.prisma.cart.findUnique({
                where: {
                    userId,
                },
            });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                },
            });
        }

        const existingItem =
            await this.prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: dto.productId,
                    },
                },
            });

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity:
                        existingItem.quantity +
                        dto.quantity,
                },
                include: {
                    product: true,
                },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            },
            include: {
                product: true,
            },
        });
    }

    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async updateQuantity(
        userId: number,
        productId: number,
        quantity: number,
    ) {
        const cart =
            await this.prisma.cart.findUnique({
                where: {
                    userId,
                },
            });

        if (!cart) {
            throw new NotFoundException(
                'Корзина не найдена',
            );
        }

        const item =
            await this.prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });

        if (!item) {
            throw new NotFoundException(
                'Товар отсутствует в корзине',
            );
        }

        return this.prisma.cartItem.update({
            where: {
                id: item.id,
            },
            data: {
                quantity,
            },
            include: {
                product: true,
            },
        });
    }

    async removeFromCart(
        userId: number,
        productId: number,
    ) {
        const cart =
            await this.prisma.cart.findUnique({
                where: {
                    userId,
                },
            });

        if (!cart) {
            throw new NotFoundException(
                'Корзина не найдена',
            );
        }

        const item =
            await this.prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });

        if (!item) {
            throw new NotFoundException(
                'Товар отсутствует в корзине',
            );
        }

        return this.prisma.cartItem.delete({
            where: {
                id: item.id,
            },
        });
    }
}