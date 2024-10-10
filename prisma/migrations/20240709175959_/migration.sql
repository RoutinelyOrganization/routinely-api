/*
  Warnings:

  - The values [personal,study,finance,career,health] on the enum `TaskCategories` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `type` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('habit', 'task');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskCategories_new" AS ENUM ('Career', 'Finance', 'Studies', 'Health', 'Leisure', 'Productivity', 'Several');
ALTER TABLE "tasks" ALTER COLUMN "category" TYPE "TaskCategories_new" USING ("category"::text::"TaskCategories_new");
ALTER TYPE "TaskCategories" RENAME TO "TaskCategories_old";
ALTER TYPE "TaskCategories_new" RENAME TO "TaskCategories";
DROP TYPE "TaskCategories_old";
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "type" "TaskType" NOT NULL,
ADD COLUMN     "weekDays" "DaysOfWeek"[],
ALTER COLUMN "finallyDate" DROP NOT NULL;
