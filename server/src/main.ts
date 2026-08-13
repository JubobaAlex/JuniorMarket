import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('JuniorMarket API')
        .setDescription('Marketplace Backend API')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Введите JWT токен',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();