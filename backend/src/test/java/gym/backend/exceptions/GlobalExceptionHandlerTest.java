package gym.backend.exceptions;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.BadCredentialsException;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;

class GlobalExceptionHandlerTest {

    private static final String REQUEST_PATH = "/api/test";

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();
    private final MockHttpServletRequest request = new MockHttpServletRequest("GET", REQUEST_PATH);

    @Test
    void mapeiaResourceNotFoundPara404() {
        ResponseEntity<ErrorResponse> response = handler.handleResourceNotFound(
            new ResourceNotFoundException("Treino nao encontrado."),
            request
        );

        assertError(response, HttpStatus.NOT_FOUND, "Treino nao encontrado.");
    }

    @Test
    void mapeiaBusinessRulePara422() {
        ResponseEntity<ErrorResponse> response = handler.handleBusinessRule(
            new BusinessRuleException("Treinamento ja esta finalizado."),
            request
        );

        assertError(response, HttpStatus.UNPROCESSABLE_ENTITY, "Treinamento ja esta finalizado.");
    }

    @Test
    void mapeiaDuplicateResourcePara409() {
        ResponseEntity<ErrorResponse> response = handler.handleDuplicateResource(
            new DuplicateResourceException("Ja existe um treinamento ativo para este usuario."),
            request
        );

        assertError(response, HttpStatus.CONFLICT, "Ja existe um treinamento ativo para este usuario.");
    }

    @Test
    void mapeiaUnauthorizedActionPara403() {
        ResponseEntity<ErrorResponse> response = handler.handleUnauthorizedAction(
            new UnauthorizedActionException("Acao nao permitida."),
            request
        );

        assertError(response, HttpStatus.FORBIDDEN, "Acao nao permitida.");
    }

    @Test
    void mapeiaBadCredentialsPara401SemExporDetalhes() {
        ResponseEntity<ErrorResponse> response = handler.handleBadCredentials(
            new BadCredentialsException("senha interna invalida"),
            request
        );

        assertError(response, HttpStatus.UNAUTHORIZED, "Credenciais invalidas.");
    }

    @Test
    void mapeiaConstraintViolationPara400() {
        ResponseEntity<ErrorResponse> response = handler.handleConstraintViolation(
            new ConstraintViolationException("startFrom nao pode estar no futuro.", Set.of()),
            request
        );

        assertError(response, HttpStatus.BAD_REQUEST, "startFrom nao pode estar no futuro.");
    }

    @Test
    void mapeiaValidationExceptionPara400() {
        ResponseEntity<ErrorResponse> response = handler.handleValidation(
            new ValidationException("Dados invalidos."),
            request
        );

        assertError(response, HttpStatus.BAD_REQUEST, "Dados invalidos.");
    }

    @Test
    void fallbackNaoExpoeDetalhesInternos() {
        ResponseEntity<ErrorResponse> response = handler.handleUnexpected(
            new SilentInternalException("internal failure details"),
            request
        );

        assertError(response, HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno ao processar requisicao.");
        assertThat(response.getBody().message()).doesNotContain("internal failure details");
    }

    private void assertError(ResponseEntity<ErrorResponse> response, HttpStatus status, String message) {
        assertThat(response.getStatusCode()).isEqualTo(status);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().timestamp()).isNotNull();
        assertThat(response.getBody().status()).isEqualTo(status.value());
        assertThat(response.getBody().error()).isEqualTo(status.getReasonPhrase());
        assertThat(response.getBody().message()).isEqualTo(message);
        assertThat(response.getBody().path()).isEqualTo(REQUEST_PATH);
    }

    private static class SilentInternalException extends RuntimeException {

        SilentInternalException(String message) {
            super(message, null, false, false);
        }
    }
}
