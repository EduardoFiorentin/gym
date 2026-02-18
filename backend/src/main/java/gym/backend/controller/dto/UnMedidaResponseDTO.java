package gym.backend.controller.dto;

import gym.backend.models.UnMedida;
import java.util.UUID;

public record UnMedidaResponseDTO(
    UUID id, 
    String name, 
    String abv
) {
    public static UnMedidaResponseDTO toDTO(UnMedida unMedida) {
        if (unMedida == null) return null;
        
        return new UnMedidaResponseDTO(
            unMedida.getId(), 
            unMedida.getName(), 
            unMedida.getAbv()
        );
    }
}