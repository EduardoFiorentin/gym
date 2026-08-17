package gym.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gym.backend.models.Serie;

@Repository
public interface SerieRepository extends JpaRepository<Serie, UUID> {
    List<Serie> findByTreinamentoIdAndTreinamentoTreinoUserLoginOrderByCreatedAtAsc(UUID treinamentoId, String login);
    Optional<Serie> findByIdAndTreinamentoIdAndTreinamentoTreinoUserLogin(UUID id, UUID treinamentoId, String login);
}
