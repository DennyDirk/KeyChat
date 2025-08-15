package com.imaginaria.app.chat.web;

import com.imaginaria.app.chat.service.RandomChatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/random-chat")
public class RandomChatController
{

    private final RandomChatService randomChatService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, Object> body)
    {
        String name = String.valueOf(body.getOrDefault("displayName", "Anonymous"));
        var res = randomChatService.join(name);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(@RequestParam String ticket)
    {
        return randomChatService.status(ticket)
                .<ResponseEntity<?>>map(m -> ResponseEntity.ok(Map.of(
                        "status", "matched",
                        "chatId", m.chatId(),
                        "partnerName", m.partnerName()
                )))
                .orElseGet(() -> ResponseEntity.ok(Map.of("status", "waiting")));
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(@RequestParam String ticket)
    {
        boolean removed = randomChatService.cancel(ticket);
        return ResponseEntity.ok(Map.of("removed", removed));
    }
}
