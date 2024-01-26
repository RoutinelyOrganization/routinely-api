/*
  Warnings:

  - The values [excercise] on the enum `TaskTags` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskTags_new" AS ENUM ('application', 'account', 'exercise', 'beauty', 'literature');
ALTER TABLE "tasks" ALTER COLUMN "tag" TYPE "TaskTags_new" USING ("tag"::text::"TaskTags_new");
ALTER TYPE "TaskTags" RENAME TO "TaskTags_old";
ALTER TYPE "TaskTags_new" RENAME TO "TaskTags";
DROP TYPE "TaskTags_old";
COMMIT;
