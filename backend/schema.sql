CREATE SCHEMA `wedding` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `wedding`;

CREATE TABLE `guests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coming` tinyint(1) NOT NULL DEFAULT '1',
  `transportation` tinyint(1) NOT NULL DEFAULT '1',
  `children` tinyint(1) NOT NULL DEFAULT '0',
  `food` text,
  `comments` text,
  `key` varchar(255) NOT NULL,
  `updated` timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Insert sample data
INSERT INTO `guests` (`name`, `coming`, `transportation`, `children`, `key`) 
VALUES ('Troels Liebe Bentsen', 1, 1, 0, "1234"), ('Andrew', 1, 1, 0, "1234"), ('Aisma Vitina', 1, 1, 0, "1234");
