-- tables
-- Table Auth
CREATE TABLE Auth (
    oauth_provider varchar(255)  NOT NULL,
    Username_username varchar(32)  NOT NULL,
    oauth_token text  NOT NULL,
    oauth_secret text  NOT NULL,
    CONSTRAINT Auth_pk PRIMARY KEY (oauth_provider,Username_username)
);

-- Table History
CREATE TABLE History (
    Username_username varchar(32)  NOT NULL,
    command varchar(100)  NOT NULL,
    timestamp timestamp  NOT NULL,
    CONSTRAINT History_pk PRIMARY KEY (Username_username,command)
);

-- Table Password
CREATE TABLE Password (
    Username_username varchar(32)  NOT NULL,
    password varchar(20)  NOT NULL,
    CONSTRAINT Password_pk PRIMARY KEY (Username_username,password)
);

-- Table Username
CREATE TABLE Username (
    username varchar(32)  NOT NULL,
    CONSTRAINT P PRIMARY KEY (username)
);





-- foreign keys
-- Reference:  Auth_Username (table: Auth)

ALTER TABLE Auth ADD CONSTRAINT Auth_Username FOREIGN KEY Auth_Username (Username_username)
    REFERENCES Username (username);
-- Reference:  History_Username (table: History)

ALTER TABLE History ADD CONSTRAINT History_Username FOREIGN KEY History_Username (Username_username)
    REFERENCES Username (username);
-- Reference:  Password_Username (table: Password)

ALTER TABLE Password ADD CONSTRAINT Password_Username FOREIGN KEY Password_Username (Username_username)
    REFERENCES Username (username);



