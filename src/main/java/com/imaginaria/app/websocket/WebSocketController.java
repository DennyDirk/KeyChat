package com.imaginaria.app.websocket;

import com.imaginaria.app.message.dto.MessageDTO;
import com.imaginaria.app.message.mapper.MessageMapper;
import com.imaginaria.app.message.model.Message;
import com.imaginaria.app.message.model.RandomChatMessage;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.OffsetDateTime;

@Controller
@AllArgsConstructor
public class WebSocketController
{
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/{chatId}")
    public void send(@DestinationVariable Long chatId, @Payload RandomChatMessage msg)
    {
        simpMessagingTemplate.convertAndSend("/topic/chat." + chatId, msg);
    }
}
