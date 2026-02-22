package gym.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.repository.TreinoRepository;
import gym.backend.services.TreinoService;


@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class TreinoController {

    @Autowired
    private TreinoService treinoService;

    @GetMapping("/treinos")
    public ResponseEntity<Object> getMethodName(@AuthenticationPrincipal UserDetails userDetails) {
        List<TreinoResponseDTO> treinos = treinoService.getAllTreinosByUser(userDetails.getUsername());
        return ResponseEntity.ok(treinos);
    }
    
}
