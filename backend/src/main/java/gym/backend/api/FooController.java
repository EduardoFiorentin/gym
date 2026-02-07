package gym.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FooController {

    @GetMapping("/public")
    public ResponseEntity<String> publicRoute() {
        return ResponseEntity.ok("Public route ok!");
    }

    @GetMapping("/private")
    public ResponseEntity<String> privateRoute(Authentication authentication) {
        return ResponseEntity.ok("Private route ok! Welcome, " + authentication.getName());
    }

    @GetMapping("/master")
    public ResponseEntity<String> masterRoute(Authentication authentication) {
        return ResponseEntity.ok("master route ok! Welcome, " + authentication.getName());
    }

}