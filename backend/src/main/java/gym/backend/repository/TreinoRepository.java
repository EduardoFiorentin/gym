package gym.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gym.backend.models.Treino;
import gym.backend.models.User;

import java.util.List;


@Repository
public interface TreinoRepository extends JpaRepository<Treino, UUID> {
    // Método usado pelo SecurityFilter e pelo Service de Autenticação
    Treino findByName(String name);
    List<Treino> findByUser(User user);

    @Query(value = "select t.*\n" + //
                "from treino t\n" + //
                "join users u on t.user_id=u.id\n" + //
                "where u.login = :username;", nativeQuery = true)
    List<Treino> findByUsername(@Param("username") String username);
}