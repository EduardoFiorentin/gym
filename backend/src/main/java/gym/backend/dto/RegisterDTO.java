package gym.backend.dto;

public record RegisterDTO(
    String name,
    String email,
    String login, 
    String password
) {

}