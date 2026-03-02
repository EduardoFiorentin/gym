package gym.backend.controller.dto;

import java.time.Instant;
import java.util.UUID;

import gym.backend.models.Treinamento;

public record TreinamentoResponseDTO(
    UUID id,
    UUID treinoId,
    String treinoName,
    Instant startedAt,
    Instant finishedAt
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
