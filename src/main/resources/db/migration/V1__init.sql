create table users
(
    id            BIGSERIAL PRIMARY KEY,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    gender        VARCHAR(10),
    birth_date    DATE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url    TEXT,
    status        VARCHAR(50),
    is_active     BOOLEAN   DEFAULT true,
    last_login    TIMESTAMP,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100),
    type       VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_users
(
    user_id   BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    chat_id   BIGINT NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
    role      VARCHAR(20) DEFAULT 'member', -- 'admin', 'member', 'owner'
    joined_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, chat_id)
);

CREATE TABLE messages
(
    id        BIGSERIAL PRIMARY KEY,
    chat_id   BIGINT NOT NULL REFERENCES chats (id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    content   TEXT   NOT NULL,
    sent_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP
);

CREATE TABLE message_reactions
(
    message_id BIGINT      NOT NULL REFERENCES messages (id) ON DELETE CASCADE,
    user_id    BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reaction   VARCHAR(50) NOT NULL,
    PRIMARY KEY (message_id, user_id, reaction)
);

CREATE TABLE attachments
(
    id          BIGSERIAL PRIMARY KEY,
    message_id  BIGINT NOT NULL REFERENCES messages (id) ON DELETE CASCADE,
    file_url    TEXT   NOT NULL,
    file_type   VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);