package gym.backend.controller.dto;

import gym.backend.models.User;

public record UserResponseDTO(
    String login,
    String name
) {
    public static UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        return new UserResponseDTO(
            user.getLogin(),
            user.getName()
        );
    }
}