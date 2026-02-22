package gym.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import gym.backend.controller.dto.AuthenticationDTO;
import gym.backend.controller.dto.LoginResponseDTO;
import gym.backend.controller.dto.UserResponseDTO;
import gym.backend.models.User;
import gym.backend.repository.UserRepository;

@Service
public class AuthenticationService {
    

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository userRepository;


    public LoginResponseDTO login(AuthenticationDTO credentials) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(credentials.login(), credentials.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User) auth.getPrincipal());
        User user = (User) userRepository.findByLogin(credentials.login());
        return new LoginResponseDTO(
            token, 
            UserResponseDTO.toDTO(user)
        );
    }
}
