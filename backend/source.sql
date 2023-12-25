create database if not exists `device_management`;
use device_management;

drop table if exists `message`;
drop table if exists `device`;
drop table if exists `user`;

CREATE TABLE `user` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(63) NOT NULL,
    `password` VARCHAR(63) NOT NULL,
    `email` VARCHAR(63) NOT NULL,
    `phone` VARCHAR(63) NOT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `device` (
    `device_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(63) NOT NULL,
    `description` VARCHAR(511) NOT NULL,
    `user_id` INT NOT NULL,
    `type` INT NOT NULL,
    `state` INT NOT NULL,
    PRIMARY KEY (`device_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `message` (
    `message_id` INT NOT NULL AUTO_INCREMENT,
    `device_id` INT NOT NULL,
    `info` VARCHAR(511) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `time` DATETIME NOT NULL,
    `alert` INT NOT NULL,
    PRIMARY KEY (`message_id`),
    FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`)
);

insert into user VALUES(
    NULL,'123456','123456','123@163.com','11111111111'
);
insert into user VALUES(
    NULL,'1234567','1234567','1234@163.com','11111111111'
);
insert into device values(
    NULL,'device1','this is device 1','1','1','1'
);
insert into device values(
    NULL,'device2','this is device 2','1','1','1'
);
insert into message VALUES(
    NULL,'1','this is mesaage test1','32','116.404','2017-07-26 00:38:14','0'
);
insert into message VALUES(
    NULL,'1','this is mesaage test2','43.3','116','2017-01-22 00:38:14','0'
);

insert into message VALUES(
    NULL,'2','this is mesaage test3','43.3','116','2017-01-22 00:38:14','0'
);