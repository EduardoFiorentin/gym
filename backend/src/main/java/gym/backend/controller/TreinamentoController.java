package gym.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import gym.backend.controller.dto.SerieRequestDTO;
import gym.backend.controller.dto.SerieResponseDTO;
import gym.backend.controller.dto.SerieUpdateRequestDTO;
import gym.backend.controller.dto.TreinamentoDetailsResponseDTO;
import gym.backend.controller.dto.TreinamentoHistoryResquestDTO;
import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.services.TreinamentoService;
import jakarta.validation.Valid;


@RestController
@RequestMapping
public class TreinamentoController {

    @Autowired
    private TreinamentoService treinamentoService;

    @PostMapping("/treinos/history")
    public ResponseEntity<List<TreinamentoResponseDTO>> getTreinamentosStartFrom(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody TreinamentoHistoryResquestDTO body
    ) {
        List<TreinamentoResponseDTO> treinamentos = treinamentoService
            .getTreinamentoHistoryByUsernameStartingFrom(userDetails.getUsername(), body.startFrom());
        return ResponseEntity.ok(treinamentos); 
    }

    @PostMapping("/treinos/{treinoId}/treinamentos")
    public ResponseEntity<TreinamentoResponseDTO> startTreinamento(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinoId
    ) {
        TreinamentoResponseDTO treinamento = treinamentoService.startTreinamento(userDetails.getUsername(), treinoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(treinamento);
    }

    @GetMapping("/treinamentos/current")
    public ResponseEntity<TreinamentoResponseDTO> getCurrentTreinamento(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Optional<TreinamentoResponseDTO> treinamento = treinamentoService.getCurrentTreinamento(userDetails.getUsername());
        if (treinamento.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(treinamento.get());
    }

    @GetMapping("/treinamentos/{treinamentoId}")
    public ResponseEntity<TreinamentoDetailsResponseDTO> getTreinamentoDetails(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId
    ) {
        TreinamentoDetailsResponseDTO treinamento = treinamentoService
            .getTreinamentoDetails(userDetails.getUsername(), treinamentoId);
        return ResponseEntity.ok(treinamento);
    }

    @PutMapping("/treinamentos/{treinamentoId}/finish")
    public ResponseEntity<TreinamentoResponseDTO> finishTreinamento(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId
    ) {
        TreinamentoResponseDTO treinamento = treinamentoService.finishTreinamento(userDetails.getUsername(), treinamentoId);
        return ResponseEntity.ok(treinamento);
    }

    @PostMapping("/treinamentos/{treinamentoId}/series")
    public ResponseEntity<SerieResponseDTO> createSerie(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId,
        @Valid @RequestBody SerieRequestDTO body
    ) {
        SerieResponseDTO serie = treinamentoService.createSerie(userDetails.getUsername(), treinamentoId, body);
        return ResponseEntity.status(HttpStatus.CREATED).body(serie);
    }

    @PutMapping("/treinamentos/{treinamentoId}/series/{serieId}")
    public ResponseEntity<SerieResponseDTO> updateSerie(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId,
        @PathVariable UUID serieId,
        @Valid @RequestBody SerieUpdateRequestDTO body
    ) {
        SerieResponseDTO serie = treinamentoService.updateSerie(userDetails.getUsername(), treinamentoId, serieId, body);
        return ResponseEntity.ok(serie);
    }

    @DeleteMapping("/treinamentos/{treinamentoId}/series/{serieId}")
    public ResponseEntity<Void> deleteSerie(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId,
        @PathVariable UUID serieId
    ) {
        treinamentoService.deleteSerie(userDetails.getUsername(), treinamentoId, serieId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/treinamentos/{treinamentoId}/series")
    public ResponseEntity<List<SerieResponseDTO>> getSeries(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID treinamentoId
    ) {
        List<SerieResponseDTO> series = treinamentoService.getSeriesByTreinamento(userDetails.getUsername(), treinamentoId);
        return ResponseEntity.ok(series);
    }
}
