-- AlterTable
ALTER TABLE "BettingLine" ADD COLUMN     "leagueId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leagueId" TEXT;

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "leagueCode" TEXT NOT NULL DEFAULT '',
    "leagueManagerId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BettingLine" ADD CONSTRAINT "BettingLine_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;
