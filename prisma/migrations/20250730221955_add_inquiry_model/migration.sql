-- CreateTable
CREATE TABLE `Inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `isSecret` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NULL,
    `isAnswered` BOOLEAN NOT NULL DEFAULT false,
    `answer` LONGTEXT NULL,
    `answeredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Inquiry_isAnswered_createdAt_idx`(`isAnswered`, `createdAt`),
    INDEX `Inquiry_isSecret_isAnswered_idx`(`isSecret`, `isAnswered`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
