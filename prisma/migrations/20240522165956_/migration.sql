/*
  Warnings:

  - The values [personal,study] on the enum `TaskCategories` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `checked` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `end_task` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityPerWeek` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeTask` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('task', 'habit', 'project');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskCategories_new" AS ENUM ('career', 'finance', 'studies', 'health', 'leisure', 'productivity', 'several');
ALTER TABLE "tasks" ALTER COLUMN "category" TYPE "TaskCategories_new" USING ("category"::text::"TaskCategories_new");
ALTER TYPE "TaskCategories" RENAME TO "TaskCategories_old";
ALTER TYPE "TaskCategories_new" RENAME TO "TaskCategories";
DROP TYPE "TaskCategories_old";
COMMIT;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "checked",
DROP COLUMN "priority",
DROP COLUMN "tag",
ADD COLUMN     "customCategoryId" INTEGER,
ADD COLUMN     "end_task" DATE NOT NULL,
ADD COLUMN     "frequencyDays" "DaysOfWeek"[],
ADD COLUMN     "quantityPerWeek" INTEGER NOT NULL,
ADD COLUMN     "typeTask" "TaskType" NOT NULL;

-- CreateTable
CREATE TABLE "customCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "customCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_customCategoryId_fkey" FOREIGN KEY ("customCategoryId") REFERENCES "customCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customCategory" ADD CONSTRAINT "customCategory_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
