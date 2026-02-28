package gym.backend.repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.models.Treinamento;

@Repository
public interface TreinamentoRepository extends JpaRepository<Treinamento, UUID> {
    
    @Query(value = "select tr.id, t.id, t.name, tr.started_at, tr.finished_at\n" + //
                "from treinamento tr\n" + //
                "join treino t on t.id = tr.treino_id\n" + //
                "join users u on u.id = t.user_id \n" + //
                "where u.login = :login \n" + //
                "and tr.started_at > :date;"
                , nativeQuery = true)
    List<TreinamentoResponseDTO> getUserTreinamentosStartingFrom(
        @Param("login") String login,
        @Param("date") LocalDateTime date
    );

}
