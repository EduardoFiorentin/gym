package gym.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.TreinoDetailsResponseDTO;
import gym.backend.controller.dto.TreinoRequestDTO;
import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.services.TreinoService;
import jakarta.validation.Valid;


@RestController
@RequestMapping
public class TreinoController {

    @Autowired
    private TreinoService treinoService;

    @GetMapping("/treinos")
    public ResponseEntity<List<TreinoResponseDTO>> getTreinos(@AuthenticationPrincipal UserDetails userDetails) {
        List<TreinoResponseDTO> treinos = treinoService.getAllTreinosByUser(userDetails.getUsername());
        return ResponseEntity.ok(treinos);
    }

    @GetMapping("/treinos/{treinoId}")
    public ResponseEntity<TreinoDetailsResponseDTO> getTreino(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinoId
    ) {
        TreinoDetailsResponseDTO treino = treinoService.getTreinoByUser(treinoId, userDetails.getUsername());
        return ResponseEntity.ok(treino);
    }

    @PostMapping("/treinos")
    public ResponseEntity<TreinoDetailsResponseDTO> createTreino(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody TreinoRequestDTO body
    ) {
        TreinoDetailsResponseDTO treino = treinoService.createTreino(userDetails.getUsername(), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(treino);
    }
    
}
