CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL DEFAULT '',
  `last_name` varchar(30) NOT NULL DEFAULT '',
  `email` varchar(30) NOT NULL DEFAULT '',
  `password` varchar(60) NOT NULL DEFAULT '',
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `created` datetime NOT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `salt` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

CREATE TABLE `history` (
  `id` int(11) unsigned NOT NULL,
  `command` varchar(200) NOT NULL DEFAULT '',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;


CREATE TABLE auth_providers (
  `id` int(11) unsigned NOT NULL,
  `oauth_session` text(1000000000) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;


-- de pus la DELIMITER // inainte
CREATE TRIGGER auth_trigger BEFORE INSERT ON auth_providers
FOR EACH ROW 
BEGIN
  DECLARE pk_count INT(2);
  SELECT count(*) INTO @pk_count FROM auth_providers WHERE id = NEW.id;

  IF @pk_count = 1 THEN
    UPDATE auth_providers SET oauth_session = NEW.oauth_session WHERE id = NEW.id;
  END IF;
END//

    

CREATE TRIGGER auth AFTER INSERT OF users
FOR EACH ROW
BEGIN
  INSERT INTO auth_providers(id,oauth_session) VALUES(NEW.id, '');
END//




