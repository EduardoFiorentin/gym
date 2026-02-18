package gym.backend.controller.dto;

import gym.backend.models.Serie;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

public record SerieResponseDTO(
    UUID id,
    BigDecimal magnitude,
    Integer execucoes,
    Timestamp createdAt,
    TreinamentoResponseDTO treinamento, 
    ExercicioResponseDTO exercicio 
) {
    public static SerieResponseDTO toDTO(Serie serie) {
        if (serie == null) return null;

        return new SerieResponseDTO(
            serie.getId(),
            serie.getMagnitude(),
            serie.getExecucoes(),
            serie.getCreatedAt(),
            TreinamentoResponseDTO.toDto(serie.getTreinamento()),
            ExercicioResponseDTO.toDTO(serie.getExercicio())
        );
    }
}