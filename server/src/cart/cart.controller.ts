import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) {}

    @ApiOperation({
        summary: 'Добавить товар в корзину',
    })
    @Post('items')
    addToCart(
        @CurrentUser() user: any,
        @Body() dto: AddToCartDto,
    ) {
        return this.cartService.addToCart(
            user.id,
            dto,
        );
    }

    @ApiOperation({
        summary: 'Получить корзину',
    })
    @Get()
    getCart(@CurrentUser() user: any) {
        return this.cartService.getCart(user.id);
    }

    @ApiOperation({
        summary: 'Изменить количество товара',
    })
    @Patch('items/:productId')
    updateQuantity(
        @CurrentUser() user: any,
        @Param('productId', ParseIntPipe)
        productId: number,
        @Body('quantity', ParseIntPipe)
        quantity: number,
    ) {
        return this.cartService.updateQuantity(
            user.id,
            productId,
            quantity,
        );
    }

    @ApiOperation({
        summary: 'Удалить товар из корзины',
    })
    @Delete('items/:productId')
    removeFromCart(
        @CurrentUser() user: any,
        @Param('productId', ParseIntPipe)
        productId: number,
    ) {
        return this.cartService.removeFromCart(
            user.id,
            productId,
        );
    }
}