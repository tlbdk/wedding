DROP SCHEMA IF EXISTS `wedding`;

CREATE SCHEMA `wedding` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `wedding`;

CREATE TABLE `invitation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  `conjugation` varchar(255),
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `guest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coming` tinyint(1),
  `transportation` tinyint(1) NOT NULL DEFAULT '0',
  `children` tinyint(1) NOT NULL DEFAULT '0',
  `food` text,
  `comments` text,
  `email` varchar(255) NOT NULL,
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `invitation_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invitation_id`) REFERENCES `invitation`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `pay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `comment` text,
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `invitation_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invitation_id`) REFERENCES `invitation`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;