import { Transform } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class QueryProductDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    maxPrice?: number;
}