package gym.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import gym.backend.models.UnMedida;

@Repository
public interface UnMedidaRepository extends JpaRepository<UnMedida, UUID>{
    
}
