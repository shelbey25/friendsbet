-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "initials" TEXT NOT NULL DEFAULT '',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BettingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BettingLine" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "time" TEXT NOT NULL DEFAULT '',
    "team1" TEXT NOT NULL DEFAULT '',
    "team2" TEXT NOT NULL DEFAULT '',
    "odds1" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "odds2" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overOdds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "underOdds" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isMoneyline" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "BettingLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selection" TEXT NOT NULL DEFAULT '',
    "potentialWin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "providerName" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("providerName","providerUserId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTask_AB_unique" ON "_TagToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTask_B_index" ON "_TagToTask"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BettingUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "BettingLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTask" ADD CONSTRAINT "_TagToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTask" ADD CONSTRAINT "_TagToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
