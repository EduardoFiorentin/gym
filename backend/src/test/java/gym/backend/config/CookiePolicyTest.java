package gym.backend.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;

import org.junit.jupiter.api.Test;

class CookiePolicyTest {

    @Test
    void normalizaSameSitePermitidos() {
        assertThat(CookiePolicy.normalizeSameSite("strict")).isEqualTo("Strict");
        assertThat(CookiePolicy.normalizeSameSite("LAX")).isEqualTo("Lax");
        assertThat(CookiePolicy.normalizeSameSite(" none ")).isEqualTo("None");
    }

    @Test
    void sameSiteNoneExigeSecure() {
        assertThatIllegalStateException()
            .isThrownBy(() -> CookiePolicy.validateSecureSameSite("gym_auth", false, "None"))
            .withMessage("Cookie gym_auth com SameSite=None exige Secure=true.");
    }
}
