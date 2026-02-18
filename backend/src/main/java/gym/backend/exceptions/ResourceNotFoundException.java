package gym.backend.exceptions;

/**
 * Exception thrown when a requested resource cannot be found in the system.
 * <p>
 * This exception should be used primarily when a database query for a specific 
 * identifier (like an ID, email, or username) returns empty. It typically maps 
 * to an HTTP 404 (Not Found) status code in the REST API response.
 * </p>
 * * @see java.lang.RuntimeException
 */
public class ResourceNotFoundException extends RuntimeException {
    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     * * @param message the detail message explaining which resource was not found.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}