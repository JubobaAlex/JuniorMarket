import { NestFactory } from '@nestjs/core';
import {
    ValidationPipe,
    Logger,
} from '@nestjs/common';
import {
    SwaggerModule,
    DocumentBuilder,
} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://server-two-wine-78.vercel.app/',
        'https://client-chi-nine-27.vercel.app'
    ];

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            logger.warn(
                `CORS blocked: ${origin}`,
            );

            callback(
                new Error(
                    `Origin ${origin} not allowed by CORS`,
                ),
            );
        },

        credentials: true,

        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS',
        ],

        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
        ],

        exposedHeaders: [
            'Content-Range',
            'X-Content-Range',
        ],

        maxAge: 3600,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('JuniorMarket API')
        .setDescription(
            'Marketplace Backend API',
        )
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description:
                    'Введите JWT токен',
            },
            'JWT-auth',
        )
        .build();

    const document =
        SwaggerModule.createDocument(
            app,
            config,
        );

    SwaggerModule.setup(
        'api',
        app,
        document,
    );

    const port =
        process.env.PORT || 3000;

    await app.listen(port);

    logger.log(
        `Application started on port ${port}`,
    );

    logger.log(
        `Swagger: /api`,
    );
}

bootstrap();