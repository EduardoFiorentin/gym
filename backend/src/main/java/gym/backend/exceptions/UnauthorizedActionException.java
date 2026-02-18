package gym.backend.exceptions;

/**
 * Exception thrown when an authenticated user attempts to perform an action 
 * or access a resource they do not have the required permissions for.
 * <p>
 * Note that this is different from an authentication failure (HTTP 401 Unauthorized). 
 * This exception assumes the user is known and logged into the system but lacks 
 * authorization for a specific operation, such as modifying another user's private 
 * workout data. It maps to an HTTP 403 (Forbidden) status code.
 * </p>
 */
public class UnauthorizedActionException extends RuntimeException {
    
    /**
     * Constructs a new UnauthorizedActionException with the specified detail message.
     * * @param message the detail message explaining why the action was denied.
     */
    public UnauthorizedActionException(String message) {
        super(message);
    }
}