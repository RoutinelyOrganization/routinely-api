import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

const account = {
  name: 'Ada Lovelace',
  email: 'admin@admin.com',
  password: 'Admin@21',
};

async function main() {
  const emailHash = createHash('sha256')
    .update(account.email + process.env.SALT_DATA)
    .digest('hex');

  await prisma.account
    .upsert({
      where: {
        email: emailHash,
      },
      update: {},
      create: {
        email: emailHash,
        password: hashSync(account.password, Number(process.env.SALT_ROUNDS)),
        profile: {
          create: {
            name: account.name,
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
    .catch((error) => {
      throw new Error('PRISMA:SEED::MAIN\n' + error);
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
