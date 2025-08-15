package com.imaginaria.app.message.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RandomChatMessage
{
    Long chatId;
    String senderUserName;
    String content;
    OffsetDateTime sentAt;
}
