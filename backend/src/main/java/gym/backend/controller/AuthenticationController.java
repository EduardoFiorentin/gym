package gym.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.AuthenticationDTO;
import gym.backend.controller.dto.LoginResponseDTO;
import gym.backend.controller.dto.RegisterRequestDTO;
import gym.backend.controller.dto.UserResponseDTO;
import gym.backend.models.User;
import gym.backend.repository.UserRepository;
import gym.backend.services.SubscribeService;
import gym.backend.services.TokenService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("auth")
public class AuthenticationController {

    static final String DEFAULT_USER_ROLE = "USER";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private SubscribeService subscribeService;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User) auth.getPrincipal());
        
        User user = (User) userRepository.findByLogin(data.login());

        // return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(new LoginResponseDTO(token, UserResponseDTO.toDTO(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequestDTO data){
        subscribeService.handlCommomUserSubscribe(data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/test/role/admin")
    public ResponseEntity<String> tokenAdmin(){
        return ResponseEntity.ok("Rota com credencial ADMIN acessada!");
    }

    @GetMapping("/test/role/manager")
    public ResponseEntity<String> tokenManager(){
        System.out.println("Retornando graciosamente...");
        return ResponseEntity.ok("Rota com credencial MANAGER acessada!");
    }

    @GetMapping("/test/role/user")
    public ResponseEntity<String> tokenUser(){
        return ResponseEntity.ok("Rota com credencial USER acessada!");
    }

}