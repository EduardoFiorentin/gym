package gym.backend.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.models.Treinamento;

@Repository
public interface TreinamentoRepository extends JpaRepository<Treinamento, UUID> {
    
    Optional<Treinamento> findByIdAndTreinoUserLogin(UUID id, String login);

    @Query("""
        select tr
        from Treinamento tr
        join fetch tr.treino t
        join fetch t.user u
        where tr.id = :id
        and u.login = :login
        """)
    Optional<Treinamento> findDetailsByIdAndTreinoUserLogin(
        @Param("id") UUID id,
        @Param("login") String login
    );

    List<Treinamento> findByTreinoUserLoginAndFinishedAtIsNull(String login);

    @Query("""
        select new gym.backend.controller.dto.TreinamentoResponseDTO(
            tr.id,
            t.id,
            t.name,
            tr.startedAt,
            tr.finishedAt
        )
        from Treinamento tr
        join tr.treino t
        join t.user u
        where u.login = :login
        and tr.startedAt > :date
        order by tr.startedAt desc
        """)
    List<TreinamentoResponseDTO> getUserTreinamentosStartingFrom(
        @Param("login") String login,
        @Param("date") Instant date
    );

}
