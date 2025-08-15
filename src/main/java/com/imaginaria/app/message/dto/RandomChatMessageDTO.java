package com.imaginaria.app.message.dto;

import java.time.OffsetDateTime;

public record RandomChatMessageDTO(Long chatId, String senderUsername, String content, OffsetDateTime sentAt)
{
}
