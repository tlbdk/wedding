DROP SCHEMA IF EXISTS `wedding`;

CREATE SCHEMA `wedding` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `wedding`;

CREATE TABLE `invitation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `guest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coming` tinyint(1) NOT NULL DEFAULT '1',
  `transportation` tinyint(1) NOT NULL DEFAULT '1',
  `children` tinyint(1) NOT NULL DEFAULT '0',
  `food` text,
  `comments` text,
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `invitation_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invitation_id`) REFERENCES `invitation`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `pay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `address` text,
  `updated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `invitation_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invitation_id`) REFERENCES `invitation`(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Insert sample data
INSERT INTO `invitation` (`title`, `key`) 
VALUES ('Dear Troels & Aisma', "1234");

INSERT INTO `guest` (`name`, `coming`, `transportation`, `children`, `invitation_id`) 
VALUES ('Troels Liebe Bentsen', 1, 1, 0, 1), ('Andrew', 1, 1, 0, 1), ('Aisma Vitina', 1, 1, 0, 1);
