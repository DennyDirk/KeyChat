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

    public record WaitingUser(String ticket, String displayName, Instant enqueuedAt)
    {
    }

    private final Queue<WaitingUser> queue = new ConcurrentLinkedQueue<>();
    // ticket -> match result
    private final Map<String, Match> matches = new ConcurrentHashMap<>();

    public record Match(Long chatId, String selfTicket, String selfName, String partnerTicket,
                        String partnerName)
    {
    }

    // Присоединиться в очередь. Если есть кто-то — сматчим сразу.
    public synchronized JoinResult join(String displayName)
    {
        // если кто-то уже ждёт — матчим
        WaitingUser waiter = queue.poll();
        if (waiter != null)
        {
            long chatId = new Random().nextLong(Long.MAX_VALUE);
            Match m1 = new Match(chatId, waiter.ticket(), waiter.displayName(), null, displayName);
            Match m2 = new Match(chatId, null, displayName, waiter.ticket(), waiter.displayName());
            matches.put(waiter.ticket(), m1);
            String myTicket = UUID.randomUUID().toString();
            matches.put(myTicket, m2);
            return JoinResult.matched(chatId, waiter.displayName(), myTicket);
        }
        // иначе — становимся в очередь
        String ticket = UUID.randomUUID().toString();
        queue.offer(new WaitingUser(ticket, displayName, Instant.now()));
        return JoinResult.waiting(ticket);
    }

    public Optional<MatchView> status(String ticket)
    {
        Match m = matches.get(ticket);
        if (m == null) return Optional.empty();
        return Optional.of(new MatchView(m.chatId(), m.partnerName()));
    }

    public boolean cancel(String ticket)
    {
        // удалить из очереди, если еще ждет
        return queue.removeIf(w -> w.ticket().equals(ticket));
    }

    // DTO для REST
    public record JoinResult(String status, String ticket, Long chatId, String partnerName)
    {
        public static JoinResult waiting(String ticket)
        {
            return new JoinResult("waiting", ticket, null, null);
        }

        public static JoinResult matched(Long chatId, String partnerName, String ticket)
        {
            return new JoinResult("matched", ticket, chatId, partnerName);
        }
    }

    public record MatchView(Long chatId, String partnerName)
    {
    }
}
