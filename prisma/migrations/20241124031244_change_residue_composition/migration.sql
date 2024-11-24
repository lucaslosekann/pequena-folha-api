/*
  Warnings:

  - Added the required column `type` to the `FormImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FormImage` ADD COLUMN `type` ENUM('ORGANIC', 'INORGANIC', 'WASTE') NOT NULL;
