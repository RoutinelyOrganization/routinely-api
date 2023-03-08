import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const profile1 = await prisma.profile.upsert({
    where: {
      userId: 'usrid123456789',
    },
    update: {},
    create: {
      userId: 'usrid123456789',
      age: 20,
    },
  });

  console.log({ profile1 });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
