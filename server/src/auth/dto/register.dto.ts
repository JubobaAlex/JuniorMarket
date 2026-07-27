import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    example: 'user@mail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: Role,
    example: Role.BUYER,
  })
  @IsEnum(Role)
  role!: Role;
}