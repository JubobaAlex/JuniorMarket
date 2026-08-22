import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import {
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { Role } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Product')
@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @Post()
    create(
        @Body() dto: CreateProductDto,
        @CurrentUser() user: {
            id: number;
            email: string;
            role: Role;
        },
    ) {
        return this.productService.create(
            dto,
            user.id,
        );
    }

    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Номер страницы',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Количество товаров на странице',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        example: 'iphone',
        description: 'Поиск по названию товара',
    })
    @ApiQuery({
        name: 'minPrice',
        required: false,
        type: Number,
        example: 100,
        description: 'Минимальная цена',
    })
    @ApiQuery({
        name: 'maxPrice',
        required: false,
        type: Number,
        example: 1000,
        description: 'Максимальная цена',
    })
    @Get()
    findAll(
        @Query() query: QueryProductDto,
    ) {
        return this.productService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
        @CurrentUser() user: {
            id: number;
            email: string;
            role: Role;
        },
    ) {
        return this.productService.update(
            id,
            dto,
            user.id,
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SELLER)
    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: {
            id: number;
            email: string;
            role: Role;
        },
    ) {
        return this.productService.remove(
            id,
            user.id,
        );
    }
}