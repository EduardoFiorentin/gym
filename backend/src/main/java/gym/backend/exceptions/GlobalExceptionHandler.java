package gym.backend.exceptions;

import java.time.Instant;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.NOT_FOUND,
            messageOrDefault(ex, "Recurso nao encontrado."),
            request
        );
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(
        BusinessRuleException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.UNPROCESSABLE_ENTITY,
            messageOrDefault(ex, "Regra de negocio violada."),
            request
        );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
        DuplicateResourceException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.CONFLICT,
            messageOrDefault(ex, "Recurso ja existe."),
            request
        );
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAction(
        UnauthorizedActionException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.FORBIDDEN,
            messageOrDefault(ex, "Acao nao permitida."),
            request
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        String message = ex.getBindingResult().getAllErrors().stream()
            .map(error -> error.getDefaultMessage())
            .filter(Objects::nonNull)
            .findFirst()
            .orElse("Payload da requisicao invalido.");

        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(
        ConstraintViolationException ex,
        HttpServletRequest request
    ) {
        String message = ex.getConstraintViolations().stream()
            .map(violation -> violation.getMessage())
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(messageOrDefault(ex, "Parametros da requisicao invalidos."));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
        HttpMessageNotReadableException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.BAD_REQUEST,
            "Payload da requisicao invalido ou ausente.",
            request
        );
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        ValidationException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.BAD_REQUEST,
            messageOrDefault(ex, "Dados da requisicao invalidos."),
            request
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
        BadCredentialsException ex,
        HttpServletRequest request
    ) {
        return buildErrorResponse(
            HttpStatus.UNAUTHORIZED,
            "Credenciais invalidas.",
            request
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(
        Exception ex,
        HttpServletRequest request
    ) {
        LOGGER.error("Unexpected API error on {}", request.getRequestURI(), ex);
        return buildErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Erro interno ao processar requisicao.",
            request
        );
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
        HttpStatus status,
        String message,
        HttpServletRequest request
    ) {
        ErrorResponse errorResponse = new ErrorResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI()
        );
        return ResponseEntity.status(status).body(errorResponse);
    }

    private String messageOrDefault(Exception ex, String defaultMessage) {
        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            return defaultMessage;
        }
        return message;
    }
}
