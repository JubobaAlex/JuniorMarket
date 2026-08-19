import {
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
} from 'class-validator';

import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiPropertyOptional({
        example: 'iPhone 15 Pro',
    })
    @IsOptional()
    @IsString()
    @Length(2, 100)
    title?: string;

    @ApiPropertyOptional({
        example: 'Обновлённое описание товара',
    })
    @IsOptional()
    @IsString()
    @Length(10, 2000)
    description?: string;

    @ApiPropertyOptional({
        example: 89990,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({
        example: 'https://example.com/iphone.jpg',
    })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}