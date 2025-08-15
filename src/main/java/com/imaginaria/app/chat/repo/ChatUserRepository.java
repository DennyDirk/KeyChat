package com.imaginaria.app.chat.repo;

import com.imaginaria.app.chat.model.ChatUser;
import com.imaginaria.app.chat.model.ChatUserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatUserRepository extends JpaRepository<ChatUser, ChatUserId>
{
}
