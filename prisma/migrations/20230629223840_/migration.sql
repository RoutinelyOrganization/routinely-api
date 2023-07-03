/*
  Warnings:

  - You are about to drop the column `expireAt` on the `ResetPasswordToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResetPasswordToken" DROP COLUMN "expireAt";
