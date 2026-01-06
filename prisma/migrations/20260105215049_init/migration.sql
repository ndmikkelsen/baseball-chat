-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "games" INTEGER NOT NULL,
    "atBats" INTEGER NOT NULL,
    "runs" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "doubles" INTEGER NOT NULL,
    "triples" INTEGER NOT NULL,
    "homeRuns" INTEGER NOT NULL,
    "rbi" INTEGER NOT NULL,
    "walks" INTEGER NOT NULL,
    "strikeouts" INTEGER NOT NULL,
    "stolenBases" INTEGER NOT NULL,
    "caughtStealing" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "obp" DOUBLE PRECISION NOT NULL,
    "slg" DOUBLE PRECISION NOT NULL,
    "ops" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Player_hits_idx" ON "Player"("hits");

-- CreateIndex
CREATE INDEX "Player_homeRuns_idx" ON "Player"("homeRuns");
