/*
  Warnings:

  - The values [personal,study,finance,career,health] on the enum `TaskTags` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `category` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskCategories" AS ENUM ('personal', 'study', 'finance', 'career', 'health');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskTags_new" AS ENUM ('application', 'account', 'excercise', 'beauty', 'literature');
ALTER TABLE "tasks" ALTER COLUMN "tag" TYPE "TaskTags_new" USING ("tag"::text::"TaskTags_new");
ALTER TYPE "TaskTags" RENAME TO "TaskTags_old";
ALTER TYPE "TaskTags_new" RENAME TO "TaskTags";
DROP TYPE "TaskTags_old";
COMMIT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "category" "TaskCategories" NOT NULL;
