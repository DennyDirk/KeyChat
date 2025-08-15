package com.imaginaria.app.chat.web;

import com.imaginaria.app.chat.model.Chat;
import com.imaginaria.app.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController
{

    private final ChatService chatService;

    @PostMapping("/group")
    public ResponseEntity<Chat> createGroup(@RequestParam String name, @RequestParam Long ownerId)
    {
        Chat chat = chatService.createGroup(name, ownerId);
        return ResponseEntity.ok(chat);
    }

    @PostMapping("/{chatId}/members")
    public ResponseEntity<Void> addMember(@PathVariable Long chatId, @RequestParam Long userId)
    {
        chatService.addMember(chatId, userId);
        return ResponseEntity.ok().build();
    }
}
