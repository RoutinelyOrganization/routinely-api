import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const getAccountSessionsAndProfile = await prisma.account.findFirst({});

  console.info(getAccountSessionsAndProfile);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
