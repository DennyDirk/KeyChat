package com.imaginaria.app.message.mapper;

import com.imaginaria.app.message.dto.MessageDTO;
import com.imaginaria.app.message.model.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper
{
    public MessageDTO toDto(Message message)
    {
        return new MessageDTO(message.getChat().getId(), message.getSender().getUsername(),
                message.getContent(), message.getSentAt());
    }
}
