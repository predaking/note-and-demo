-- predaking.card definition

CREATE TABLE `card` (
  `id` tinyint NOT NULL,
  `name` varchar(4) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `country_id` tinyint NOT NULL,
  `skills` json DEFAULT NULL,
  `top` tinyint NOT NULL,
  `bottom` tinyint NOT NULL,
  `left` tinyint NOT NULL,
  `right` tinyint NOT NULL,
  `quality` tinyint NOT NULL,
  `level` tinyint NOT NULL,
  `plus` json NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `card_dot_check` CHECK (((`top` between 0 and 9) and (`bottom` between 0 and 9) and (`left` between 0 and 9) and (`right` between 0 and 9))),
  CONSTRAINT `card_level_check` CHECK ((`level` between 1 and 5)),
  CONSTRAINT `card_quality_check` CHECK ((`quality` between 0 and 2)),
  CONSTRAINT `country_id_check` CHECK ((`country_id` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- predaking.skill definition

CREATE TABLE `skill` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `name` varchar(4) NOT NULL,
  `desc` varchar(100) NOT NULL,
  `is_judge` tinyint(1) NOT NULL DEFAULT '0',
  `is_lock` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- predaking.`user` definition

CREATE TABLE `user` (
  `id` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `salt` varchar(32) DEFAULT NULL,
  `ip` varchar(16) DEFAULT NULL,
  `last_register_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;