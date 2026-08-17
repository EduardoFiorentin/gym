package gym.backend.services;

import gym.backend.controller.dto.UserResponseDTO;

public record LoginResult(
    String token,
    UserResponseDTO user
) {
}
