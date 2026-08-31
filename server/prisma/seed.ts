import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const seller = await prisma.user.findFirst({
        where: {
            role: Role.SELLER,
        },
    });

    if (!seller) {
        throw new Error(
            'Продавец не найден. Сначала зарегистрируй пользователя с ролью SELLER.',
        );
    }

    const products = Array.from(
        { length: 50 },
        (_, index) => ({
            title: `Тестовый товар ${index + 1}`,
            description: `Описание тестового товара номер ${index + 1}`,
            price: (index + 1) * 1000,
            imageUrl: `https://picsum.photos/300/300?random=${index + 1}`,
            sellerId: seller.id,
        }),
    );

    await prisma.product.createMany({
        data: products,
    });

    console.log('Создано 50 тестовых товаров');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });