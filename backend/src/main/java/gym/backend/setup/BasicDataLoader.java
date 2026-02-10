package gym.backend.setup;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

import gym.backend.models.Role;
import gym.backend.models.User;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;

@Configuration
public class BasicDataLoader {
    
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (userRepository.count() == 0 && roleRepository.count() == 0) {

                // 1. Criar Roles (Corrigido nomes das variáveis)
                Role roleAdmin = new Role();
                roleAdmin.setName("ADMIN");

                Role roleUser = new Role();
                roleUser.setName("USER");

                Role roleManager = new Role();
                roleManager.setName("MANAGER");

                roleRepository.saveAll(List.of(roleAdmin, roleUser, roleManager));

                // 2. Criar Usuários (Corrigido instâncias dos objetos)
                User userAdmin = new User();
                userAdmin.setName("Eduardo Fiorentin");
                userAdmin.setEmail("eduardo@gmail.com");
                userAdmin.setLogin("eduardo");
                userAdmin.setRoles(Set.of(roleAdmin, roleUser));
                userAdmin.setPassword(passwordEncoder.encode("eduardo"));
                
                User userDefault = new User();
                userDefault.setName("Eduarda Rampaneli");
                userDefault.setEmail("eduarda@gmail.com");
                userDefault.setLogin("eduarda");
                userDefault.setRoles(Set.of(roleUser));
                userDefault.setPassword(passwordEncoder.encode("eduarda"));

                User userManager = new User();
                userManager.setName("Manager");
                userManager.setEmail("manager@gmail.com");
                userManager.setLogin("manager");
                userManager.setRoles(Set.of(roleAdmin, roleUser, roleManager));
                userManager.setPassword(passwordEncoder.encode("manager"));

                userRepository.saveAll(List.of(userAdmin, userDefault, userManager));
            }
        };
    }

}
