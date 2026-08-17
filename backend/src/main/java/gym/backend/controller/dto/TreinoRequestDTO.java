package gym.backend.controller.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record TreinoRequestDTO(
    @NotBlank(message = "O nome do treino e obrigatorio")
    @Size(max = 25, message = "O nome do treino deve ter no maximo 25 caracteres")
    String name,

    @Valid
    @NotEmpty(message = "Informe pelo menos um exercicio")
    List<ExercicioRequestDTO> exercicios
) {}
