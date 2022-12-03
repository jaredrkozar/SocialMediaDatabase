USE SocialMedia;

CREATE TABLE users (
    user_id BIGINT(255) AUTO_INCREMENT,
	user_firstName VARCHAR(10),
	user_lastName VARCHAR(15),
	user_name VARCHAR(20),
	user_password VARCHAR(20),
	user_avatar VARCHAR(255),
	bioText VARCHAR(50),
	mobilePhone VARCHAR(30),
	registerDate DATE,
	PRIMARY KEY (user_id)
);

CREATE TABLE user_tweets (
    tweet_id BIGINT(255) AUTO_INCREMENT,
    tweet_text VARCHAR(255),
    date_posted DATE,
    user_id BIGINT(255),
	PRIMARY KEY (tweet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE user_likes (
    tweet_id BIGINT(255),
    user_id BIGINT(255),
    FOREIGN KEY(tweet_id) REFERENCES user_tweets(tweet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE user_followers (
    user_follower_id BIGINT(255),
    current_user_id BIGINT(255),
    FOREIGN KEY(user_follower_id) REFERENCES users(user_id),
    FOREIGN KEY(current_user_id) REFERENCES users(user_id)
);

CREATE TABLE blocked_users (
    blocked_user_id BIGINT(255) PRIMARY KEY,
    user_id BIGINT(255),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE user_tweets (
    tweet_id BIGINT(255) AUTO_INCREMENT,
	tweet_text VARCHAR(10),
	date_posted VARCHAR(10),
	user_id VARCHAR(20),
	PRIMARY KEY (tweet_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE tweet_urls (
    tweet_url_id BIGINT(255) PRIMARY KEY,
    tweet_id BIGINT(255),
    FOREIGN KEY(tweet_id) REFERENCES user_tweets(tweet_id)
);

CREATE TABLE employees (
    employee_id BIGINT(255) PRIMARY KEY,
    employee_name VARCHAR(50),
    employee_manager VARCHAR(50),
	username VARCHAR(50),
	email VARCHAR(50),
	currentPassword VARCHAR(50)
);
 
CREATE TABLE employee_department (
    employee_department_id BIGINT(50) PRIMARY KEY,
    department_name VARCHAR(50),
    department_manager VARCHAR(50),
    employee_id BIGINT(255),
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
 );
 
 CREATE TABLE employee_project (
     project_name VARCHAR(50),
     project_manager VARCHAR(50),
     project_duedate DATE,
     employee_id BIGINT(255) auto_increment,
     FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
 ); 
 
CREATE TABLE employee_assignment (
    assignment_name VARCHAR(50),
    assignment_duedate DATE,
    employee_id BIGINT(255) auto_increment,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)  
);

