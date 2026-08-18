import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}