import {
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        example: 'iPhone 15',
        description: 'Название товара',
    })
    @IsString()
    @Length(2, 100)
    title!: string;

    @ApiProperty({
        example: 'Новый смартфон Apple',
        description: 'Описание товара',
    })
    @IsString()
    @Length(10, 2000)
    description!: string;

    @ApiProperty({
        example: 79990,
        description: 'Цена товара',
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    price!: number;

    @ApiPropertyOptional({
        example: 'https://example.com/iphone.jpg',
        description: 'URL изображения товара',
    })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}