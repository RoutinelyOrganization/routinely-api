/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH,URGENT] on the enum `TaskPriorities` will be removed. If these variants are still used in the database, this will fail.
  - The values [PERSONAL,STUDY,FINANCE,CAREER,HEALTH] on the enum `TaskTags` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `Task` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskPriorities_new" AS ENUM ('low', 'medium', 'high', 'urgent');
ALTER TABLE "Task" ALTER COLUMN "priority" TYPE "TaskPriorities_new" USING ("priority"::text::"TaskPriorities_new");
ALTER TYPE "TaskPriorities" RENAME TO "TaskPriorities_old";
ALTER TYPE "TaskPriorities_new" RENAME TO "TaskPriorities";
DROP TYPE "TaskPriorities_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskTags_new" AS ENUM ('personal', 'study', 'finance', 'career', 'health');
ALTER TABLE "Task" ALTER COLUMN "tag" TYPE "TaskTags_new" USING ("tag"::text::"TaskTags_new");
ALTER TYPE "TaskTags" RENAME TO "TaskTags_old";
ALTER TYPE "TaskTags_new" RENAME TO "TaskTags";
DROP TYPE "TaskTags_old";
COMMIT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "date",
DROP COLUMN "hour",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
