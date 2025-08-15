CREATE UNIQUE INDEX IF NOT EXISTS users_username_uq ON users (username);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_ci_uq ON users (lower(email));

CREATE INDEX IF NOT EXISTS messages_chat_id_idx ON messages (chat_id);
CREATE INDEX IF NOT EXISTS messages_chat_id_id_idx ON messages (chat_id, id);
CREATE INDEX IF NOT EXISTS messages_chat_id_sent_idx ON messages (chat_id, sent_at);

CREATE INDEX IF NOT EXISTS user_chats_chat_idx ON chat_users (chat_id);
CREATE INDEX IF NOT EXISTS user_chats_user_idx ON chat_users (user_id);