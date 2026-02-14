package gym.backend.controller.dto;

import jakarta.validation.constraints.Size;

public record RegisterDTO(
    @Size(min=5, max = 10)
    String name,
    String email,
    String login, 
    String password
) {

}