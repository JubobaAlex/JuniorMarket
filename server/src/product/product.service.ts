import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(dto: CreateProductDto, sellerId: number) {
        return this.prisma.product.create({
            data: {
                title: dto.title,
                description: dto.description,
                price: dto.price,
                imageUrl: dto.imageUrl,
                sellerId,
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }
}