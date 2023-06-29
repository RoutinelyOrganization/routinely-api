/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ResetPasswordToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");
