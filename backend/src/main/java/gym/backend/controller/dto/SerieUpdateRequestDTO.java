package gym.backend.controller.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SerieUpdateRequestDTO(
    @NotNull(message = "A magnitude e obrigatoria")
    @DecimalMin(value = "0.00", inclusive = true, message = "A magnitude nao pode ser negativa")
    BigDecimal magnitude,

    @NotNull(message = "A quantidade de execucoes e obrigatoria")
    @Min(value = 1, message = "A quantidade de execucoes deve ser maior que zero")
    Integer execucoes
) {}
