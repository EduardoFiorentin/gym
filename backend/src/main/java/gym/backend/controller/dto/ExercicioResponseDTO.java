package gym.backend.controller.dto;

import gym.backend.models.Exercicio;
import java.sql.Timestamp;
import java.util.UUID;

public record ExercicioResponseDTO(
    UUID id,
    String name,
    Boolean active,
    Timestamp inativatedAt,
    Timestamp createdAt,
    Timestamp updatedAt,
    TreinoResponseDTO treino,
    UnMedidaResponseDTO unMedida
) {
    public static ExercicioResponseDTO toDTO(Exercicio exercicio) {
        if (exercicio == null) return null;

        return new ExercicioResponseDTO(
            exercicio.getId(),
            exercicio.getName(),
            exercicio.getActive(),
            exercicio.getInativatedAt(),
            exercicio.getCreatedAt(),
            exercicio.getUpdatedAt(),
            TreinoResponseDTO.toDTO(exercicio.getTreino()),
            UnMedidaResponseDTO.toDTO(exercicio.getUnMedida())
        );
    }
}