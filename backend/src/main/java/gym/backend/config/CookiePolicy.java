package gym.backend.config;

public final class CookiePolicy {

    private CookiePolicy() {
    }

    public static String normalizeSameSite(String sameSite) {
        if (sameSite == null || sameSite.isBlank()) {
            return "Lax";
        }

        return switch (sameSite.trim().toLowerCase()) {
            case "strict" -> "Strict";
            case "lax" -> "Lax";
            case "none" -> "None";
            default -> throw new IllegalArgumentException("Valor SameSite invalido para cookie: " + sameSite);
        };
    }

    public static void validateSecureSameSite(String cookieName, boolean secure, String sameSite) {
        if ("None".equals(normalizeSameSite(sameSite)) && !secure) {
            throw new IllegalStateException("Cookie " + cookieName + " com SameSite=None exige Secure=true.");
        }
    }
}
