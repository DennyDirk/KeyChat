package com.imaginaria.app.message.repo;

import com.imaginaria.app.message.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long>, JpaSpecificationExecutor<Message>
{

    Page<Message> findByChat_IdOrderBySentAtAsc(Long chatId, Pageable pageable);

    Slice<Message> findByChat_IdAndIdLessThanOrderByIdDesc(Long chatId, Long beforeId, Pageable pageable);

    Slice<Message> findByChat_IdAndIdGreaterThanOrderByIdAsc(Long chatId, Long afterId, Pageable pageable);

    boolean existsByIdAndChat_Id(Long id, Long chatId);

    long countByChat_Id(Long chatId);

    @Query("""
           select m
           from Message m
           where m.chat.id = :chatId
             and (:q is null or :q = '' or lower(m.content) like lower(concat('%', :q, '%')))
           order by m.sentAt desc
           """)
    Page<Message> searchInChat(@Param("chatId") Long chatId,
                               @Param("q") String query,
                               Pageable pageable);

    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"sender"})
    Page<Message> findByChat_IdOrderByIdDesc(Long chatId, Pageable pageable);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
           update Message m
              set m.content = :content,
                  m.editedAt = CURRENT_TIMESTAMP
            where m.id = :id and m.sender.id = :senderId
           """)
    int editIfOwner(@Param("id") Long id,
                    @Param("senderId") Long senderId,
                    @Param("content") String content);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Message m where m.chat.id = :chatId")
    int deleteAllByChatId(@Param("chatId") Long chatId);

    interface ReactionCount {
        Long getMessageId();
        String getReaction();
        long getCount();
    }

    @Query("""
           select mr.messageReactionId.messageId as messageId,
                  mr.messageReactionId.reaction  as reaction,
                  count(mr.messageReactionId.userId) as count
             from MessageReaction mr
            where mr.messageReactionId.messageId in :messageIds
            group by mr.messageReactionId.messageId, mr.messageReactionId.reaction
           """)
    List<ReactionCount> countReactions(@Param("messageIds") Collection<Long> messageIds);

}
