import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(dto);

    response.cookie('jwt', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Успешная авторизация' };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Удалить свой аккаунт' })
  @Delete('delete')
  async deleteAccount(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.deleteAccount(user.id);

    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return { message: 'Аккаунт успешно удалён' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return { message: 'Выход выполнен успешно' };
  }
}