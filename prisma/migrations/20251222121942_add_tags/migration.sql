/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Author` table. All the data in the column will be lost.
  - The `id` column on the `Author` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Quote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `importHash` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Quote` table. All the data in the column will be lost.
  - The `id` column on the `Quote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `authorId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Made the column `language` on table `Quote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Quote_importHash_key";

-- AlterTable
ALTER TABLE "Author" DROP CONSTRAINT "Author_pkey",
DROP COLUMN "bio",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Author_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "importHash",
DROP COLUMN "isDeleted",
DROP COLUMN "source",
DROP COLUMN "tags",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" DROP DEFAULT,
ADD CONSTRAINT "Quote_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuoteTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_QuoteTags_AB_unique" ON "_QuoteTags"("A", "B");

-- CreateIndex
CREATE INDEX "_QuoteTags_B_index" ON "_QuoteTags"("B");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteTags" ADD CONSTRAINT "_QuoteTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteTags" ADD CONSTRAINT "_QuoteTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
