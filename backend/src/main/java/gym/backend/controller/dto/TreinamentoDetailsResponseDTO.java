package gym.backend.controller.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import gym.backend.models.Exercicio;
import gym.backend.models.Serie;
import gym.backend.models.Treinamento;

public record TreinamentoDetailsResponseDTO(
    UUID id,
    Instant startedAt,
    Instant finishedAt,
    TreinoDetailsResponseDTO treino,
    List<SerieDetailsResponseDTO> series
) {
    public static TreinamentoDetailsResponseDTO toDTO(
        Treinamento treinamento,
        List<Exercicio> exercicios,
        List<Serie> series
    ) {
        return new TreinamentoDetailsResponseDTO(
            treinamento.getId(),
            treinamento.getStartedAt(),
            treinamento.getFinishedAt(),
            TreinoDetailsResponseDTO.toDTO(treinamento.getTreino(), exercicios),
            series.stream().map(SerieDetailsResponseDTO::toDTO).toList()
        );
    }
}
