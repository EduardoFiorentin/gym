package gym.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gym.backend.models.Treino;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, UUID> {
    // Método usado pelo SecurityFilter e pelo Service de Autenticação
    Treino findByName(String name);
}