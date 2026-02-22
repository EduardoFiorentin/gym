package gym.backend.controller.dto;

public record LoginResponseDTO(
    String token,
    UserResponseDTO user
) {
}