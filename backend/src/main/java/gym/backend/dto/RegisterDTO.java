package gym.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record RegisterDTO(
    @Min(10)
    @Max(15)
    String name,
    String email,
    String login, 
    String password
) {

}