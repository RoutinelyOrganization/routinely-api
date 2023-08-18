/*
  Warnings:

  - You are about to drop the column `deadline` on the `Task` table. All the data in the column will be lost.
  - Added the required column `date` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "deadline",
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "hour" TIME NOT NULL;
