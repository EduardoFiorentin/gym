package gym.backend.controller.dto;

import java.sql.Timestamp;
import java.util.UUID;

import gym.backend.models.Treinamento;

public record TreinamentoResponseDTO(
    UUID id,
    UUID treinoId,
    String treinoName,
    Timestamp startedAt,
    Timestamp finishedAt
) {
    
    public static TreinamentoResponseDTO toDto(Treinamento treinamento) {
        return new TreinamentoResponseDTO(
            treinamento.getId(),
            // TreinoResponseDTO.toDTO(treinamento.getTreino()),
            treinamento.getTreino().getId(),
            treinamento.getTreino().getName(),
            treinamento.getStartedAt(),
            treinamento.getFinishedAt()
        );
    }   

}
