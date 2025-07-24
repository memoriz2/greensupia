/*
  Warnings:

  - You are about to drop the column `content` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `history` table. All the data in the column will be lost.
  - Added the required column `description` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0,
    MODIFY `year` VARCHAR(191) NOT NULL;
