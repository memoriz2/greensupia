/*
  Warnings:

  - You are about to drop the column `department` on the `organizationchart` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `organizationchart` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `organizationchart` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `organizationchart` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `organizationchart` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `OrganizationChart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `organizationchart` DROP FOREIGN KEY `OrganizationChart_parentId_fkey`;

-- DropIndex
DROP INDEX `OrganizationChart_parentId_fkey` ON `organizationchart`;

-- Delete all existing data
DELETE FROM `organizationchart`;

-- AlterTable
ALTER TABLE `organizationchart` DROP COLUMN `department`,
    DROP COLUMN `level`,
    DROP COLUMN `name`,
    DROP COLUMN `parentId`,
    DROP COLUMN `position`,
    ADD COLUMN `imageUrl` TEXT NOT NULL;
