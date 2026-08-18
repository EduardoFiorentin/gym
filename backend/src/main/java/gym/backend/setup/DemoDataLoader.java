package gym.backend.setup;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import gym.backend.models.Role;
import gym.backend.models.User;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;

@Configuration
@Profile({"dev", "test"})
public class DemoDataLoader {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE + 1)
    CommandLineRunner seedDemoUsers(
        RoleRepository roleRepository,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            Role roleAdmin = BasicDataLoader.requireExistingRole(roleRepository, BasicDataLoader.ROLE_ADMIN);
            Role roleUser = BasicDataLoader.requireExistingRole(roleRepository, BasicDataLoader.ROLE_USER);
            Role roleManager = BasicDataLoader.requireExistingRole(roleRepository, BasicDataLoader.ROLE_MANAGER);

            createDemoUserIfMissing(
                userRepository,
                passwordEncoder,
                "Eduardo Fiorentin",
                "eduardo@gmail.com",
                "eduardo",
                "eduardo",
                Set.of(roleAdmin, roleUser)
            );
            createDemoUserIfMissing(
                userRepository,
                passwordEncoder,
                "Eduarda Rampaneli",
                "eduarda@gmail.com",
                "eduarda",
                "eduarda",
                Set.of(roleUser)
            );
            createDemoUserIfMissing(
                userRepository,
                passwordEncoder,
                "Manager",
                "manager@gmail.com",
                "manager",
                "manager",
                Set.of(roleAdmin, roleUser, roleManager)
            );
        };
    }

    private void createDemoUserIfMissing(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        String name,
        String email,
        String login,
        String rawPassword,
        Set<Role> roles
    ) {
        if (userRepository.findByLogin(login) != null) {
            return;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setLogin(login);
        user.setRoles(roles);
        user.setPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(user);
    }
}
