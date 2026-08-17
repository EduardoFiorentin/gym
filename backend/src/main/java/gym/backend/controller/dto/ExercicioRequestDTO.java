package gym.backend.controller.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExercicioRequestDTO(
    @NotBlank(message = "O nome do exercicio e obrigatorio")
    @Size(max = 255, message = "O nome do exercicio deve ter no maximo 255 caracteres")
    String name,

    UUID unMedidaId
) {}
