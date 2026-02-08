package gym.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.config.TokenService;
import gym.backend.dto.AuthenticationDTO;
import gym.backend.dto.LoginResponseDTO;
import gym.backend.dto.RegisterDTO;
import gym.backend.models.Role;
import gym.backend.models.User;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    static final String DEFAULT_USER_ROLE = "USER";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

        String encryptedPassword = passwordEncoder.encode(data.password());
        
        Role userRole = roleRepository.findByName(DEFAULT_USER_ROLE);

        User newUser = new User();
        newUser.setName(data.name());
        newUser.setEmail(data.email());
        newUser.setLogin(data.login());
        newUser.setPassword(encryptedPassword);
        newUser.getRoles().add(userRole);

        userRepository.save(newUser);

        return ResponseEntity.ok("Usuario criado!");
        // return ResponseEntity.ok("Login foi um sucesso :)");
    }

    @GetMapping("/test/role/admin")
    public ResponseEntity<String> tokenAdmin(){
        return ResponseEntity.ok("Rota com credencial ADMIN acessada!");
    }

    @GetMapping("/test/role/manager")
    public ResponseEntity<String> tokenManager(){
        return ResponseEntity.ok("Rota com credencial MANAGER acessada!");
    }

    @GetMapping("/test/role/user")
    public ResponseEntity<String> tokenUser(){
        return ResponseEntity.ok("Rota com credencial USER acessada!");
    }
}