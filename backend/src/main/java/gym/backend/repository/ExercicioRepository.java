package gym.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import gym.backend.models.Exercicio;

public interface ExercicioRepository extends JpaRepository<Exercicio, UUID> {
    
}
