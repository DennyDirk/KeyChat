package com.imaginaria.app.chat.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class RandomChatService
{

    public record WaitingUser(String ticket, String displayName, String avatarSrc, Instant enqueuedAt)
    {
    }

    private final Queue<WaitingUser> queue = new ConcurrentLinkedQueue<>();

    private final Map<String, Match> matches = new ConcurrentHashMap<>();

    public record Match(Long chatId, String selfTicket, String selfName, String selfAvatarSrc, String partnerTicket,
                        String partnerName, String partnerAvatarSrc)
    {
    }

    // Присоединиться в очередь. Если есть кто-то — сматчим сразу.
    public synchronized JoinResult join(String displayName, String avatarSrc)
    {
        // если кто-то уже ждёт — матчим
        WaitingUser waiter = queue.poll();
        if (waiter != null)
        {
            long chatId = new Random().nextLong(Long.MAX_VALUE);
            Match m1 = new Match(chatId, waiter.ticket(), waiter.displayName(), waiter.avatarSrc(), null, displayName,
                    avatarSrc);
            Match m2 = new Match(chatId, null, displayName, avatarSrc, waiter.ticket(), waiter.displayName(),
                    waiter.avatarSrc());
            matches.put(waiter.ticket(), m1);
            String myTicket = UUID.randomUUID().toString();
            matches.put(myTicket, m2);
            return JoinResult.matched(chatId, waiter.displayName(), myTicket, waiter.avatarSrc());
        }
        // иначе — становимся в очередь
        String ticket = UUID.randomUUID().toString();
        queue.offer(new WaitingUser(ticket, displayName, avatarSrc, Instant.now()));
        return JoinResult.waiting(ticket);
    }

    public Optional<MatchView> status(String ticket)
    {
        Match m = matches.get(ticket);
        if (m == null) return Optional.empty();
        return Optional.of(new MatchView(m.chatId(), m.partnerName(), m.partnerAvatarSrc()));
    }

    public boolean cancel(String ticket)
    {
        // удалить из очереди, если еще ждет
        return queue.removeIf(w -> w.ticket().equals(ticket));
    }

    // DTO для REST
    public record JoinResult(String status, String ticket, Long chatId, String partnerName, String partnerAvatarSrc)
    {
        public static JoinResult waiting(String ticket)
        {
            return new JoinResult("waiting", ticket, null, null, null);
        }

        public static JoinResult matched(Long chatId, String partnerName, String ticket, String partnerAvatarSrc)
        {
            return new JoinResult("matched", ticket, chatId, partnerName, partnerAvatarSrc);
        }
    }

    public record MatchView(Long chatId, String partnerName, String partnerAvatarSrc)
    {
    }
}
