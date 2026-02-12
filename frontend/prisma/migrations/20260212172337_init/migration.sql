-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "respect" INTEGER NOT NULL DEFAULT 0,
    "money" REAL NOT NULL DEFAULT 500,
    "tokenBalance" REAL NOT NULL DEFAULT 0,
    "health" INTEGER NOT NULL DEFAULT 100,
    "maxHealth" INTEGER NOT NULL DEFAULT 100,
    "stamina" INTEGER NOT NULL DEFAULT 100,
    "maxStamina" INTEGER NOT NULL DEFAULT 100,
    "tickets" INTEGER NOT NULL DEFAULT 200,
    "addiction" REAL NOT NULL DEFAULT 0,
    "profession" TEXT NOT NULL DEFAULT 'GANGSTER',
    "professionLevel" INTEGER NOT NULL DEFAULT 1,
    "professionXp" INTEGER NOT NULL DEFAULT 0,
    "strength" INTEGER NOT NULL DEFAULT 10,
    "defense" INTEGER NOT NULL DEFAULT 10,
    "intelligence" INTEGER NOT NULL DEFAULT 10,
    "charisma" INTEGER NOT NULL DEFAULT 10,
    "agility" INTEGER NOT NULL DEFAULT 10,
    "isInPrison" BOOLEAN NOT NULL DEFAULT false,
    "prisonUntil" DATETIME,
    "isInHospital" BOOLEAN NOT NULL DEFAULT false,
    "hospitalUntil" DATETIME,
    "lastRobberyAt" DATETIME,
    "lastAssaultAt" DATETIME,
    "lastDrugUseAt" DATETIME,
    "lastTrainingAt" DATETIME,
    "nonce" TEXT,
    "roundId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Player_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "GameRound" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundNumber" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "gameDayLength" INTEGER NOT NULL DEFAULT 360,
    "totalGameDays" INTEGER NOT NULL DEFAULT 156,
    "currentGameDay" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tokenRewardPool" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RoundRanking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "respect" INTEGER NOT NULL,
    "tokenReward" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "RoundRanking_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "GameRound" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RobberyDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "levelRequired" INTEGER NOT NULL,
    "staminaCost" INTEGER NOT NULL,
    "baseDifficulty" REAL NOT NULL,
    "minRewardMoney" REAL NOT NULL,
    "maxRewardMoney" REAL NOT NULL,
    "minRewardRespect" INTEGER NOT NULL,
    "maxRewardRespect" INTEGER NOT NULL,
    "tokenReward" REAL NOT NULL DEFAULT 0,
    "cooldownSeconds" INTEGER NOT NULL DEFAULT 30,
    "isGangRobbery" BOOLEAN NOT NULL DEFAULT false,
    "minGangMembers" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "RobberyAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "robberyId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "moneyEarned" REAL NOT NULL DEFAULT 0,
    "respectEarned" INTEGER NOT NULL DEFAULT 0,
    "tokensEarned" REAL NOT NULL DEFAULT 0,
    "wasCaught" BOOLEAN NOT NULL DEFAULT false,
    "gangId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RobberyAttempt_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RobberyAttempt_robberyId_fkey" FOREIGN KEY ("robberyId") REFERENCES "RobberyDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrugDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "staminaRestore" INTEGER NOT NULL,
    "addictionRate" REAL NOT NULL,
    "buyPrice" REAL NOT NULL,
    "sellPrice" REAL NOT NULL,
    "ticketsRequired" INTEGER NOT NULL DEFAULT 1,
    "levelRequired" INTEGER NOT NULL DEFAULT 1,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "DrugInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "DrugInventory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DrugInventory_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "DrugDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assault" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attackerId" TEXT NOT NULL,
    "defenderId" TEXT NOT NULL,
    "attackerWon" BOOLEAN NOT NULL,
    "damageDealt" INTEGER NOT NULL,
    "moneyStolen" REAL NOT NULL DEFAULT 0,
    "respectGained" INTEGER NOT NULL DEFAULT 0,
    "respectLost" INTEGER NOT NULL DEFAULT 0,
    "attackerCaught" BOOLEAN NOT NULL DEFAULT false,
    "weaponUsedId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assault_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assault_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HospitalVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "healthRestored" INTEGER NOT NULL DEFAULT 0,
    "addictionReduced" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HospitalVisit_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profession" TEXT,
    "levelRequired" INTEGER NOT NULL DEFAULT 1,
    "cost" REAL NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "statBoosts" TEXT NOT NULL,
    "prerequisiteId" TEXT,
    CONSTRAINT "SkillDefinition_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "SkillDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UniversityEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completesAt" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UniversityEnrollment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UniversityEnrollment_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "SkillDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CasinoBet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "betAmount" REAL NOT NULL,
    "payout" REAL NOT NULL DEFAULT 0,
    "won" BOOLEAN NOT NULL,
    "details" TEXT,
    "serverSeed" TEXT NOT NULL,
    "clientSeed" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CasinoBet_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gang" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT,
    "leaderId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "respect" INTEGER NOT NULL DEFAULT 0,
    "money" REAL NOT NULL DEFAULT 0,
    "maxMembers" INTEGER NOT NULL DEFAULT 10,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GangMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gangId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GangMember_gangId_fkey" FOREIGN KEY ("gangId") REFERENCES "Gang" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GangMember_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrisonRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "sentenceEnd" DATETIME NOT NULL,
    "bribeCost" REAL,
    "escaped" BOOLEAN NOT NULL DEFAULT false,
    "escapedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrisonRecord_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "levelRequired" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL,
    "tokenPrice" REAL NOT NULL DEFAULT 0,
    "stats" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isTokenOnly" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isEquipped" BOOLEAN NOT NULL DEFAULT false,
    "durability" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "InventoryItem_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarketListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT,
    "itemId" TEXT,
    "drugId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "pricePerUnit" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "txSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "soldAt" DATETIME,
    CONSTRAINT "MarketListing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MarketListing_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MarketListing_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "MarketListing_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "DrugDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "txSignature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TokenTransaction_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StakingPosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "amountStaked" REAL NOT NULL DEFAULT 0,
    "stakedAt" DATETIME,
    "lastClaimAt" DATETIME,
    "tier" TEXT NOT NULL DEFAULT 'NONE',
    CONSTRAINT "StakingPosition_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_walletAddress_key" ON "Player"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE INDEX "Player_walletAddress_idx" ON "Player"("walletAddress");

-- CreateIndex
CREATE INDEX "Player_respect_idx" ON "Player"("respect");

-- CreateIndex
CREATE INDEX "Player_level_idx" ON "Player"("level");

-- CreateIndex
CREATE INDEX "Player_roundId_idx" ON "Player"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "GameRound_roundNumber_key" ON "GameRound"("roundNumber");

-- CreateIndex
CREATE INDEX "RoundRanking_roundId_rank_idx" ON "RoundRanking"("roundId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "RoundRanking_roundId_playerId_key" ON "RoundRanking"("roundId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "RobberyDefinition_name_key" ON "RobberyDefinition"("name");

-- CreateIndex
CREATE INDEX "RobberyAttempt_playerId_createdAt_idx" ON "RobberyAttempt"("playerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DrugDefinition_name_key" ON "DrugDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DrugInventory_playerId_drugId_key" ON "DrugInventory"("playerId", "drugId");

-- CreateIndex
CREATE INDEX "Assault_attackerId_createdAt_idx" ON "Assault"("attackerId", "createdAt");

-- CreateIndex
CREATE INDEX "Assault_defenderId_createdAt_idx" ON "Assault"("defenderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SkillDefinition_name_key" ON "SkillDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityEnrollment_playerId_skillId_key" ON "UniversityEnrollment"("playerId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Gang_name_key" ON "Gang"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Gang_tag_key" ON "Gang"("tag");

-- CreateIndex
CREATE INDEX "Gang_respect_idx" ON "Gang"("respect");

-- CreateIndex
CREATE UNIQUE INDEX "GangMember_playerId_key" ON "GangMember"("playerId");

-- CreateIndex
CREATE INDEX "GangMember_gangId_idx" ON "GangMember"("gangId");

-- CreateIndex
CREATE INDEX "PrisonRecord_playerId_createdAt_idx" ON "PrisonRecord"("playerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ItemDefinition_name_key" ON "ItemDefinition"("name");

-- CreateIndex
CREATE INDEX "InventoryItem_playerId_idx" ON "InventoryItem"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_playerId_itemId_key" ON "InventoryItem"("playerId", "itemId");

-- CreateIndex
CREATE INDEX "MarketListing_status_createdAt_idx" ON "MarketListing"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MarketListing_sellerId_idx" ON "MarketListing"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenTransaction_txSignature_key" ON "TokenTransaction"("txSignature");

-- CreateIndex
CREATE INDEX "TokenTransaction_playerId_createdAt_idx" ON "TokenTransaction"("playerId", "createdAt");

-- CreateIndex
CREATE INDEX "TokenTransaction_txSignature_idx" ON "TokenTransaction"("txSignature");

-- CreateIndex
CREATE UNIQUE INDEX "StakingPosition_playerId_key" ON "StakingPosition"("playerId");

-- CreateIndex
CREATE INDEX "StakingPosition_tier_idx" ON "StakingPosition"("tier");

-- CreateIndex
CREATE INDEX "Notification_playerId_isRead_createdAt_idx" ON "Notification"("playerId", "isRead", "createdAt");
