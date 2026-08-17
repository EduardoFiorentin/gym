package gym.backend.controller.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import gym.backend.models.Serie;
import gym.backend.models.Treinamento;

public record PreviousExercisePerformanceResponseDTO(
    UUID treinamentoId,
    UUID exercicioId,
    Instant startedAt,
    Instant finishedAt,
    List<SerieDetailsResponseDTO> series
) {
    public static PreviousExercisePerformanceResponseDTO toDTO(
        UUID exercicioId,
        Treinamento treinamento,
        List<Serie> series
    ) {
        return new PreviousExercisePerformanceResponseDTO(
            treinamento.getId(),
            exercicioId,
            treinamento.getStartedAt(),
            treinamento.getFinishedAt(),
            series.stream().map(SerieDetailsResponseDTO::toDTO).toList()
        );
    }
}
