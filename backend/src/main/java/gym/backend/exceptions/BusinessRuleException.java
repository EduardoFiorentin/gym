package gym.backend.exceptions;

/**
 * Exception thrown when a specific domain or business rule is violated.
 * <p>
 * Use this exception to enforce the application's internal logic and constraints, 
 * such as preventing an inactive exercise from being added to a workout routine, 
 * or ensuring a valid numeric range for workout sets. It usually maps to an 
 * HTTP 400 (Bad Request) or 422 (Unprocessable Entity) status code.
 * </p>
 */
public class BusinessRuleException extends RuntimeException {
    /**
     * Constructs a new BusinessRuleException with the specified detail message.
     * * @param message the detail message explaining exactly which business rule was violated.
     */
    public BusinessRuleException(String message) {
        super(message);
    }
}