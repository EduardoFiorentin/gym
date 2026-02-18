package gym.backend.controller.dto;

import gym.backend.models.Treino;
import java.util.UUID;

public record TreinoResponseDTO(
    UUID id, 
    String name
) {
    public static TreinoResponseDTO toDTO(Treino treino) {
        if (treino == null) return null;
        
        return new TreinoResponseDTO(
            treino.getId(), 
            treino.getName()
        );
    }
}