package gym.backend.exceptions;

/**
 * Exception thrown when an attempt is made to create or update a resource 
 * that would result in a conflict with existing data.
 * <p>
 * Common use cases include trying to register a user with an email that is already 
 * in use (violating a UNIQUE constraint), or creating a duplicate workout plan. 
 * This exception maps perfectly to an HTTP 409 (Conflict) status code.
 * </p>
 */
public class DuplicateResourceException extends RuntimeException {
   
    /**
     * Constructs a new DuplicateResourceException with the specified detail message.
     * * @param message the detail message describing the conflicting resource.
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}