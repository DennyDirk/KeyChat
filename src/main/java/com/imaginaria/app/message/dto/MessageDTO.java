package com.imaginaria.app.message.dto;

import java.time.OffsetDateTime;

public record MessageDTO(Long chatId, String senderId, String content, OffsetDateTime sentAt)
{
}
