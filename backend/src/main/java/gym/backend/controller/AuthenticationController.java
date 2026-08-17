package gym.backend.controller;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.AuthenticationDTO;
import gym.backend.controller.dto.LoginResponseDTO;
import gym.backend.controller.dto.RegisterRequestDTO;
import gym.backend.controller.dto.UserResponseDTO;
import gym.backend.services.AuthenticationService;
import gym.backend.services.LoginResult;
import gym.backend.services.SubscribeService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("auth")
public class AuthenticationController {
    
    @Autowired
    private SubscribeService subscribeService;

    @Autowired
    private AuthenticationService authenticationService;

    @Value("${auth.cookie.name:gym_auth}")
    private String authCookieName;

    @Value("${auth.cookie.secure:false}")
    private boolean authCookieSecure;

    @Value("${auth.cookie.same-site:Lax}")
    private String authCookieSameSite;

    @Value("${auth.cookie.max-age-seconds:7200}")
    private long authCookieMaxAgeSeconds;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data){
        LoginResult loginResult = authenticationService.login(data);
        ResponseCookie authCookie = buildAuthCookie(loginResult.token(), authCookieMaxAgeSeconds);

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, authCookie.toString())
            .body(new LoginResponseDTO(loginResult.user()));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponseDTO> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponseDTO user = authenticationService.getAuthenticatedUser(userDetails.getUsername());
        return ResponseEntity.ok(new LoginResponseDTO(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie expiredCookie = buildAuthCookie("", 0);
        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
            .build();
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequestDTO data){
        subscribeService.handlCommomUserSubscribe(data);
        return ResponseEntity.ok().build();
    }

    private ResponseCookie buildAuthCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(authCookieName, token)
            .httpOnly(true)
            .secure(authCookieSecure)
            .sameSite(authCookieSameSite)
            .path("/")
            .maxAge(Duration.ofSeconds(maxAgeSeconds))
            .build();
    }

}
