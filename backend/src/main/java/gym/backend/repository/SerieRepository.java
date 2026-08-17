package gym.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import gym.backend.models.Serie;

@Repository
public interface SerieRepository extends JpaRepository<Serie, UUID> {
    List<Serie> findByTreinamentoIdAndTreinamentoTreinoUserLoginOrderByCreatedAtAsc(UUID treinamentoId, String login);
    Optional<Serie> findByIdAndTreinamentoIdAndTreinamentoTreinoUserLogin(UUID id, UUID treinamentoId, String login);

    @Query("""
        select s
        from Serie s
        join fetch s.exercicio e
        join fetch e.unMedida
        join fetch s.treinamento tr
        join fetch tr.treino t
        join t.user u
        where tr.id = :treinamentoId
        and u.login = :login
        order by s.createdAt asc, s.id asc
        """)
    List<Serie> findDetailsByTreinamentoIdAndTreinoUserLogin(
        @Param("treinamentoId") UUID treinamentoId,
        @Param("login") String login
    );

    @Query("""
        select tr.id
        from Serie s
        join s.exercicio e
        join s.treinamento tr
        join tr.treino t
        join t.user u
        where e.id = :exercicioId
        and u.login = :login
        and tr.finishedAt is not null
        group by tr.id, tr.startedAt, tr.finishedAt
        order by tr.startedAt desc, tr.finishedAt desc, tr.id asc
        """)
    List<UUID> findLatestFinishedTreinamentoIdsByExercicioAndUserLogin(
        @Param("exercicioId") UUID exercicioId,
        @Param("login") String login,
        Pageable pageable
    );

    @Query("""
        select s
        from Serie s
        join fetch s.exercicio e
        join fetch e.unMedida
        join fetch s.treinamento tr
        join fetch tr.treino t
        join t.user u
        where tr.id = :treinamentoId
        and e.id = :exercicioId
        and u.login = :login
        and tr.finishedAt is not null
        order by s.createdAt asc, s.id asc
        """)
    List<Serie> findPreviousPerformanceSeries(
        @Param("treinamentoId") UUID treinamentoId,
        @Param("exercicioId") UUID exercicioId,
        @Param("login") String login
    );
}
