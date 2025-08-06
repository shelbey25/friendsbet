/*
  Warnings:

  - You are about to drop the `BettingUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "initials" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winnings" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "BettingUser";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
