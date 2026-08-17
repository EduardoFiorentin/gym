package gym.backend.controller.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import gym.backend.models.Serie;

public record SerieDetailsResponseDTO(
    UUID id,
    UUID exercicioId,
    BigDecimal magnitude,
    Integer execucoes,
    Instant createdAt
) {
    public static SerieDetailsResponseDTO toDTO(Serie serie) {
        return new SerieDetailsResponseDTO(
            serie.getId(),
            serie.getExercicio().getId(),
            serie.getMagnitude(),
            serie.getExecucoes(),
            serie.getCreatedAt().toInstant()
        );
    }
}
