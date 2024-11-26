-- AlterTable
ALTER TABLE `Agenda` ADD COLUMN `additionalText` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `eventsImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `eventsImages` ADD CONSTRAINT `eventsImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Agenda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
