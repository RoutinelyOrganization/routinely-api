import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const account = {
  name: 'Ada Lovelace',
  email: '5edfa2692bdacc5e6ee805c626c50cb44cebb065f092d9a1067d89f74dacd326',
  password: '$2b$04$X.eN36HDOKZ4V.fBGbJiveCvVG9RM6Z5rESSxX7O.c40j7O7chjfi',
};

async function main() {
  const { email, password, name } = account;

  await prisma.account
    .upsert({
      where: {
        email,
      },
      update: {},
      create: {
        email,
        password,
        profile: {
          create: {
            name,
          },
        },
      },
    })
    .then(() => {
      console.info('\n------SEED------');
      console.info('Seed account credentials:');
      console.info(`email: admin@admin.com`);
      console.info(`pass: admin`);
      console.info('--------END-------\n');
    })
    .catch(() => {
      throw new Error('PRISMA:SEED::MAIN');
    });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
