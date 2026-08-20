import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(
        dto: CreateProductDto,
        sellerId: number,
    ) {
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

    async findAll(query: QueryProductDto) {
    const {
        page = 1,
        limit = 10,
        search,
    } = query;

    const skip = (page - 1) * limit;

    const where = search
        ? {
              title: {
                  contains: search,
                  mode: 'insensitive' as const,
              },
          }
        : {};

    const [products, total] = await Promise.all([
        this.prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),

        this.prisma.product.count({
            where,
        }),
    ]);

    return {
        products,

        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
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
            throw new NotFoundException(
                'Product not found',
            );
        }

        return product;
    }

    async update(
        id: number,
        dto: UpdateProductDto,
        sellerId: number,
    ) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException(
                'You can only update your own products',
            );
        }

        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async remove(id: number, sellerId: number) {
    const product = await this.prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== sellerId) {
        throw new ForbiddenException(
            'You can only delete your own products',
        );
    }

    return this.prisma.product.delete({
        where: { id },
    });

}
}