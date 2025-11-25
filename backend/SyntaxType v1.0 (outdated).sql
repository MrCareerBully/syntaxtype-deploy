CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(50) UNIQUE NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `lessons` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp
);

CREATE TABLE `lesson_teachers` (
  `lesson_id` int NOT NULL,
  `teacher_id` int NOT NULL,
  PRIMARY KEY(lesson_id,teacher_id)
);

CREATE TABLE `lesson_students` (
  `lesson_id` int NOT NULL,
  `student_id` int NOT NULL,
  `enrolled_at` timestamp DEFAULT (now()),
  PRIMARY KEY(lesson_id,student_id)
);

CREATE TABLE `lesson_content` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `lesson_id` int NOT NULL,
  `content` text NOT NULL,
  `content_type` ENUM('text','video','code') NOT NULL
);

CREATE TABLE `exercises` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `lesson_id` int NOT NULL,
  `question` text NOT NULL,
  `correct_answer` varchar(255) NOT NULL
);

CREATE TABLE `progress` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `lesson_id` int NOT NULL,
  `completed` boolean DEFAULT false,
  `score` int DEFAULT 0
);

CREATE TABLE `challenges` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_by` int NOT NULL
);

CREATE TABLE `challenge_attempts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `challenge_id` int NOT NULL,
  `score` int NOT NULL,
  `completed_at` timestamp
);

CREATE TABLE `typing_tests` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `lesson_id` int,
  `wpm` int NOT NULL,
  `accuracy` float NOT NULL,
  `test_date` timestamp
);

CREATE TABLE `achievements` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text
);

CREATE TABLE `user_achievements` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `awarded_at` timestamp
);

CREATE TABLE `leaderboard` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `score` int NOT NULL,
  `category` ENUM('challenges','typing','overall') NOT NULL,
  `recorded_at` timestamp
);

CREATE TABLE `statistics` (
  `wpm` int,
  `accuracy` int,
  `fastest_time` timestamp
)

ALTER TABLE `lesson_teachers` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `lesson_teachers` ADD FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`);

ALTER TABLE `lesson_students` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `lesson_students` ADD FOREIGN KEY (`student_id`) REFERENCES `users` (`id`);

ALTER TABLE `lesson_content` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `exercises` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `progress` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `progress` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `challenges` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `challenge_attempts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `challenge_attempts` ADD FOREIGN KEY (`challenge_id`) REFERENCES `challenges` (`id`);

ALTER TABLE `typing_tests` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `typing_tests` ADD FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`);

ALTER TABLE `user_achievements` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_achievements` ADD FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`);

ALTER TABLE `leaderboard` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `statistics` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);