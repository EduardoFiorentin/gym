package gym.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import gym.backend.models.Exercicio;

public interface ExercicioRepository extends JpaRepository<Exercicio, UUID> {
    List<Exercicio> findByTreinoIdAndTreinoUserLoginAndActiveTrueOrderByCreatedAtAsc(UUID treinoId, String login);
    Optional<Exercicio> findByIdAndTreinoIdAndTreinoUserLoginAndActiveTrue(UUID id, UUID treinoId, String login);
    boolean existsByIdAndTreinoUserLogin(UUID id, String login);

    @EntityGraph(attributePaths = "unMedida")
    List<Exercicio> findByTreinoIdAndTreinoUserLoginOrderByCreatedAtAscIdAsc(UUID treinoId, String login);
}
