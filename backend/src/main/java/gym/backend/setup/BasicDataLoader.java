package gym.backend.setup;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import gym.backend.models.Role;
import gym.backend.repository.RoleRepository;

@Configuration
public class BasicDataLoader {

    static final String ROLE_ADMIN = "ADMIN";
    static final String ROLE_USER = "USER";
    static final String ROLE_MANAGER = "MANAGER";

    static final List<String> REQUIRED_ROLE_NAMES = List.of(ROLE_ADMIN, ROLE_USER, ROLE_MANAGER);

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    CommandLineRunner seedRequiredRoles(RoleRepository roleRepository) {
        return args -> REQUIRED_ROLE_NAMES.forEach(roleName -> createRoleIfMissing(roleRepository, roleName));
    }

    static Role requireExistingRole(RoleRepository roleRepository, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            throw new IllegalStateException("Role estrutural obrigatoria nao encontrada: " + roleName);
        }
        return role;
    }

    private static Role createRoleIfMissing(RoleRepository roleRepository, String roleName) {
        Role existingRole = roleRepository.findByName(roleName);
        if (existingRole != null) {
            return existingRole;
        }

        Role role = new Role();
        role.setName(roleName);
        return roleRepository.save(role);
    }
}
