package gym.backend.controller.dto;

import java.util.List;
import java.util.UUID;

import gym.backend.models.Exercicio;
import gym.backend.models.Treino;

public record TreinoDetailsResponseDTO(
    UUID id,
    String name,
    List<ExercicioResponseDTO> exercicios
) {
    public static TreinoDetailsResponseDTO toDTO(Treino treino, List<Exercicio> exercicios) {
        return new TreinoDetailsResponseDTO(
            treino.getId(),
            treino.getName(),
            exercicios.stream().map(ExercicioResponseDTO::toDTO).toList()
        );
    }
}
