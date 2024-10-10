/*
  Warnings:

  - You are about to drop the column `priority` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `finallyDate` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityPerWeek` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "priority",
DROP COLUMN "tag",
ADD COLUMN     "finallyDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quantityPerWeek" INTEGER NOT NULL;
