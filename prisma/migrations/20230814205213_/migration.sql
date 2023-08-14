-- CreateEnum
CREATE TYPE "TaskPriorities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskTags" AS ENUM ('PERSONAL', 'STUDY', 'FINANCE', 'CAREER', 'HEALTH');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hour" TIME NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TaskPriorities" NOT NULL,
    "tag" "TaskTags" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
