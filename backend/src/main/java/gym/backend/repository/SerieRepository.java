package gym.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
}
