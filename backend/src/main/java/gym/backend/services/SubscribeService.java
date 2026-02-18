package gym.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import gym.backend.controller.dto.RegisterRequestDTO;
import gym.backend.models.Role;
import gym.backend.models.User;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;
import jakarta.validation.ValidationException;

@Service
public class SubscribeService {
    static final String DEFAULT_USER_ROLE = "USER";
    // @Autowired
    // private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public void handlCommomUserSubscribe(RegisterRequestDTO data) {
        
        if(this.userRepository.findByLogin(data.login()) != null)
            throw new ValidationException("Já existe um usuário com o login especificado!");

        String encryptedPassword = passwordEncoder.encode(data.password());
        
        Role userRole = roleRepository.findByName(DEFAULT_USER_ROLE);

        User newUser = new User();
        newUser.setName(data.name());
        newUser.setEmail(data.email());
        newUser.setLogin(data.login());
        newUser.setPassword(encryptedPassword);
        newUser.getRoles().add(userRole);

        userRepository.save(newUser);
    }

}
