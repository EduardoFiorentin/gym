package gym.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gym.backend.models.Treinamento;

@Repository
public interface TreinamentoRepository extends JpaRepository<Treinamento, UUID> {
    
}
