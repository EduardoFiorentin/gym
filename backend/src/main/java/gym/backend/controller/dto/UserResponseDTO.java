package gym.backend.controller.dto;

import gym.backend.models.User;

public record UserResponseDTO(
    String login,
    String name
) {
    public static UserResponseDTO toDTO(User user) {
        if (user == null) return null;

        // Set<TreinoResponseDTO> treinosConvertidos = 
        //     user.getTreinos() != null 
        //     ? user.getTreinos().stream()
        //         .map(TreinoResponseDTO::toDTO)
        //         .collect(Collectors.toSet())
        //     : Set.of();

        return new UserResponseDTO(
            user.getLogin(),
            user.getName()
        );
    }
}