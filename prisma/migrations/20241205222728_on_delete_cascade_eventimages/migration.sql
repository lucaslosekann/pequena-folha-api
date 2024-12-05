-- DropForeignKey
ALTER TABLE `EventsImages` DROP FOREIGN KEY `EventsImages_eventId_fkey`;

-- AddForeignKey
ALTER TABLE `EventsImages` ADD CONSTRAINT `EventsImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Agenda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
