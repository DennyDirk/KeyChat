package com.imaginaria.app.chat.repo;

import com.imaginaria.app.chat.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long>
{
}
