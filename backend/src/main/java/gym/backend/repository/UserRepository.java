package gym.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import gym.backend.models.User;
import jakarta.persistence.LockModeType;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Método usado pelo SecurityFilter e pelo Service de Autenticação
    @EntityGraph(attributePaths = "roles") // always bring roles
    UserDetails findByLogin(String login);

    @Query("select u from User u where u.login = :login")
    Optional<User> findEntityByLogin(@Param("login") String login);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.login = :login")
    Optional<User> lockByLogin(@Param("login") String login);
}
