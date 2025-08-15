package com.imaginaria.app.chat.service;

import com.imaginaria.app.chat.model.Chat;
import com.imaginaria.app.chat.model.ChatUser;
import com.imaginaria.app.chat.model.ChatUserId;
import com.imaginaria.app.chat.repo.ChatRepository;
import com.imaginaria.app.chat.repo.ChatUserRepository;
import com.imaginaria.app.common.ChatType;
import com.imaginaria.app.common.UserRole;
import com.imaginaria.app.user.model.User;
import com.imaginaria.app.user.repo.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.NoSuchElementException;

// chat/service/ChatService.java
@Service
@RequiredArgsConstructor
public class ChatService
{
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatUserRepository chatUserRepository;

    @Transactional
    public Chat createGroup(String name, Long ownerId)
    {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new NoSuchElementException("User not found"));
        Chat chat = chatRepository.save(Chat.builder().name(name).type(ChatType.GROUP).build());
        chatUserRepository.save(new ChatUser(new ChatUserId(owner.getId(), chat.getId()), owner, chat, UserRole.OWNER, null));
        return chat;
    }

    @Transactional
    public void addMember(Long chatId, Long userId)
    {
        if (chatUserRepository.existsById(new ChatUserId(userId, chatId))) return;
        User u = userRepository.findById(userId).orElseThrow();
        Chat c = chatRepository.findById(chatId).orElseThrow();
        chatUserRepository.save(new ChatUser(new ChatUserId(userId, chatId), u, c, UserRole.MEMBER, OffsetDateTime.now()));
    }
}

