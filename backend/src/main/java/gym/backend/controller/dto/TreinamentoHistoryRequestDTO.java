package gym.backend.controller.dto;

import java.time.Instant;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record TreinamentoHistoryRequestDTO (
    @NotNull(message = "startFrom e obrigatorio.")
    @PastOrPresent(message = "startFrom nao pode estar no futuro.")
    Instant startFrom
) {}
