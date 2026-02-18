package gym.backend.controller.dto;

import java.sql.Timestamp;
import java.util.UUID;

import gym.backend.models.Treinamento;

public record TreinamentoResponseDTO(
    UUID id,
    TreinoResponseDTO treino,
    Timestamp startedAt,
    Timestamp finishedAt
) {
    
    public static TreinamentoResponseDTO toDto(Treinamento treinamento) {
        return new TreinamentoResponseDTO(
            treinamento.getId(),
            TreinoResponseDTO.toDTO(treinamento.getTreino()),
            treinamento.getStartedAt(),
            treinamento.getFinishedAt()
        );
    }   

}
