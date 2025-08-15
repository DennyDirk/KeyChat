package com.imaginaria.app.user.repo;

import com.imaginaria.app.common.UserStatus;
import com.imaginaria.app.user.model.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>
{
    Optional<User> findByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);

    interface UserSummary
    {
        Long getId();

        String getUsername();

        String getEmail();

        String getFirstName();

        String getLastName();

        String getStatus();

        boolean isActive();

        OffsetDateTime getLastLogin();
    }

    @EntityGraph(type = EntityGraph.EntityGraphType.LOAD, attributePaths = {"memberships"})
    Optional<User> findWithMembershipsById(Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update User u set u.status = :status where u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") UserStatus status);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update User u set u.lastLogin = CURRENT_TIMESTAMP where u.id = :id")
    int updateLastLogin(@Param("id") Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update User u set u.isActive = false where u.id in :ids")
    int deactivate(@Param("ids") Collection<Long> ids);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.id = :id")
    Optional<User> findForUpdate(@Param("id") Long id);

    @Query("""
            select u.id as id, u.username as username, u.firstName as firstName,
                   u.lastName as lastName, u.isActive as isActive, u.status as status,
                               u.lastLogin as lastLogin
            from User u
            where (:q is null or :q = '' or
                   lower(u.username) like lower(concat('%', :q, '%')) or
                   lower(u.firstName) like lower(concat('%', :q, '%')) or
                   lower(u.lastName)  like lower(concat('%', :q, '%')))
              and (:active is null or u.isActive = :active)
            """)
    Page<UserSummary> search(@Param("q") String q,
                             @Param("active") Boolean active,
                             Pageable pageable);
}
