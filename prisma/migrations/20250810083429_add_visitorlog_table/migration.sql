-- CreateTable
CREATE TABLE `visitorlog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isBot` BOOLEAN NOT NULL DEFAULT false,
    `botName` VARCHAR(191) NULL,

    INDEX `visitorlog_timestamp_idx`(`timestamp`),
    INDEX `visitorlog_isBot_idx`(`isBot`),
    INDEX `visitorlog_path_idx`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
