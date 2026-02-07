package gym.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.config.TokenService;
import gym.backend.dto.AuthenticationDTO;
import gym.backend.dto.LoginResponseDTO;
import gym.backend.dto.RegisterDTO;
import gym.backend.enums.UserRole;
import gym.backend.models.User;
import gym.backend.repository.UserRepository;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        
        var auth = authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO data){
        
        if(this.userRepository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();   

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        
        User newUser = new User(data.login(), encryptedPassword, UserRole.USER);
        userRepository.save(newUser);

        return ResponseEntity.ok("Usuario criado!");
        // return ResponseEntity.ok("Login foi um sucesso :)");
    }

    @GetMapping("/token/test")
    public ResponseEntity<String> tokenTest(){
        return ResponseEntity.ok("Rota com credencial ADMIN acessada!");
        // return ResponseEntity.ok("Login foi um sucesso :)");
    }

}