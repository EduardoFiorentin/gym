package gym.backend.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
    @Size(max = 255)
    @NotBlank
    String name,
    
    @NotBlank
    @Email
    String email,
    
    @NotBlank
    @Size(max = 50)
    String login, 

    @NotBlank
    @Size(min = 5, max = 255)
    String password
) {

}