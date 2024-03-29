-- AUTO-GENERATED FILE.

-- This file is an auto-generated file by Ballerina persistence layer for the migrate command.
-- Please verify the generated scripts and execute them against the target DB server.

DROP TABLE IF EXISTS `CategoryBudget`;
DROP TABLE IF EXISTS `ExpenseItem`;
DROP TABLE IF EXISTS `ExpenseCategory`;

CREATE TABLE `ExpenseCategory` (
	`id` VARCHAR(191) NOT NULL,
	`name` VARCHAR(191) NOT NULL,
	`description` VARCHAR(191) NOT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE `ExpenseItem` (
	`id` VARCHAR(191) NOT NULL,
	`description` VARCHAR(191) NOT NULL,
	`amount` DECIMAL(65,30) NOT NULL,
	`date` VARCHAR(191) NOT NULL,
	`comment` VARCHAR(191),
	`categoryId` VARCHAR(191) NOT NULL,
	FOREIGN KEY(`categoryId`) REFERENCES `ExpenseCategory`(`id`),
	PRIMARY KEY(`id`)
);

CREATE TABLE `CategoryBudget` (
	`id` VARCHAR(191) NOT NULL,
	`amount` DECIMAL(65,30) NOT NULL,
	`year` VARCHAR(191) NOT NULL,
	`month` VARCHAR(191) NOT NULL,
	`categorybudgetId` VARCHAR(191) UNIQUE NOT NULL,
	FOREIGN KEY(`categorybudgetId`) REFERENCES `ExpenseCategory`(`id`),
	PRIMARY KEY(`id`)
);
