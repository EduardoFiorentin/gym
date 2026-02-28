package gym.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import gym.backend.controller.dto.TreinamentoHistoryResquestDTO;
import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.services.TreinamentoService;


@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class TreinamentoController {

    @Autowired
    private TreinamentoService treinamentoService;

    @PostMapping("/treinos/history")
    public ResponseEntity<List<TreinamentoResponseDTO>> getTreinamentosStartFrom(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody TreinamentoHistoryResquestDTO body
    ) {
        
        System.out.println("Resultado: " + body.toString());
        
        List<TreinamentoResponseDTO> treinamentos = treinamentoService
            .getTreinamentoHistoryByUsernameStartingFrom(userDetails.getUsername(), body.startFrom());
        return ResponseEntity.ok(treinamentos); 
    }
}
