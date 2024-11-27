/*
  Warnings:

  - You are about to drop the `eventsImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `eventsImages` DROP FOREIGN KEY `eventsImages_eventId_fkey`;

-- DropTable
DROP TABLE `eventsImages`;

-- CreateTable
CREATE TABLE `EventsImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventsImages` ADD CONSTRAINT `EventsImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Agenda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
