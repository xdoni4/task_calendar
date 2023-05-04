CREATE TABLE IF NOT EXISTS user (
    id          INTEGER,
    username    text       NOT NULL,
    password    text       NOT NULL,
    PRIMARY KEY ("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS task (
    id          INTEGER,
    text        TEXT        NOT NULL,
    date        DATETIME,
    user_id     INTEGER     REFERENCES user(id),
    completed   INTEGER,
    PRIMARY KEY ("id" AUTOINCREMENT)
);