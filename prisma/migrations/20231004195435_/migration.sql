-- CreateEnum
CREATE TYPE "GoalPeriodicity" AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'bimonthly');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('personal', 'profissional');

-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "periodicity" "GoalPeriodicity" NOT NULL,
    "type" "GoalType" NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
