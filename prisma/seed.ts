import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const account = {
  name: 'Ada Lovelace',
  email: '5edfa2692bdacc5e6ee805c626c50cb44cebb065f092d9a1067d89f74dacd326',
  password: '$2b$04$eJIhkVp9S0deCc75.NAeieZEv2DAlfxsGtg7ml3OpID.Gr1VIRKuG',
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
      console.info(`pass: Admin@11`);
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
