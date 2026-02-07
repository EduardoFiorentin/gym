package gym.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import gym.backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Método usado pelo SecurityFilter e pelo Service de Autenticação
    UserDetails findByLogin(String login);
}