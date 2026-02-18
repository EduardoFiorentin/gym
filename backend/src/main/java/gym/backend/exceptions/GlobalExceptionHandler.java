package gym.backend.exceptions;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;


@RestControllerAdvice
public class GlobalExceptionHandler {

// 1. Tratamento para Recurso Não Encontrado (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest     request) {
        ErrorResponse error = new ErrorResponse(
            Instant.now(),
            HttpStatus.NOT_FOUND.value(),
            HttpStatus.NOT_FOUND.getReasonPhrase(),
            ex.getMessage(),
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 2. Tratamento para Violação de Regra de Negócio (422)
    // O 422 (Unprocessable Entity) é mais semântico que o 400 para erros de domínio.
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(BusinessRuleException ex, HttpServletRequest     request) {
        ErrorResponse error = new ErrorResponse(
            Instant.now(),
            HttpStatus.UNPROCESSABLE_ENTITY.value(),
            HttpStatus.UNPROCESSABLE_ENTITY.getReasonPhrase(),
            ex.getMessage(),
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }

    // 3. Tratamento para Recurso Duplicado / Conflito (409)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(DuplicateResourceException ex, HttpServletRequest   request) {
        ErrorResponse error = new ErrorResponse(
            Instant.now(),
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage(),
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    // 4. Tratamento para Ação Não Autorizada (403)
    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAction(UnauthorizedActionException ex, HttpServletRequest     request) {
        ErrorResponse error = new ErrorResponse(
            Instant.now(),
            HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.getReasonPhrase(),
            ex.getMessage(),
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(MethodArgumentNotValidException ex, HttpServletRequest  request) {
        ErrorResponse errorResponse = new ErrorResponse(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "",
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);

    }

    // TODO See what is the correct HTTP code for this response
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ValidationException ex, HttpServletRequest  request) {
        ErrorResponse errorResponse = new ErrorResponse(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage(),
            request.getRequestURI() // Retorna "/api/treinos/123"
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}

