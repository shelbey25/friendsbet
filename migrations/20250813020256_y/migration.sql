/*
  Warnings:

  - A unique constraint covering the columns `[leagueCode]` on the table `League` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "League_leagueCode_key" ON "League"("leagueCode");
