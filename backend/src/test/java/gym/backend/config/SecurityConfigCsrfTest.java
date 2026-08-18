package gym.backend.config;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "cors.allowed-origins=http://localhost:5173",
    "auth.cookie.name=gym_auth",
    "auth.cookie.secure=false",
    "auth.cookie.same-site=Lax",
    "csrf.cookie.secure=false",
    "csrf.cookie.same-site=Lax"
})
@AutoConfigureMockMvc
class SecurityConfigCsrfTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void emiteCookieCsrfParaFrontend() throws Exception {
        mockMvc.perform(get("/auth/csrf"))
            .andExpect(status().isNoContent())
            .andExpect(cookie().exists("XSRF-TOKEN"))
            .andExpect(cookie().path("XSRF-TOKEN", "/"))
            .andExpect(cookie().sameSite("XSRF-TOKEN", "Lax"))
            .andExpect(cookie().httpOnly("XSRF-TOKEN", false))
            .andExpect(cookie().secure("XSRF-TOKEN", false));
    }

    @Test
    void rejeitaMetodoMutavelSemCsrf() throws Exception {
        mockMvc.perform(post("/auth/logout"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.message").value("Token CSRF invalido ou ausente."))
            .andExpect(jsonPath("$.path").value("/auth/logout"));
    }

    @Test
    void aceitaMetodoMutavelComCsrfEMantemCookieAuthHttpOnly() throws Exception {
        mockMvc.perform(post("/auth/logout").with(csrf()))
            .andExpect(status().isNoContent())
            .andExpect(header().string(HttpHeaders.SET_COOKIE, allOf(
                containsString("gym_auth="),
                containsString("Max-Age=0"),
                containsString("Path=/"),
                containsString("HttpOnly"),
                containsString("SameSite=Lax"),
                not(containsString("Secure"))
            )));
    }

    @Test
    void corsPermiteOrigemEHeaderCsrfConfigurados() throws Exception {
        mockMvc.perform(options("/treinos/history")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type,X-XSRF-TOKEN"))
            .andExpect(status().isOk())
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
            .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, allOf(
                containsString("Content-Type"),
                containsString("X-XSRF-TOKEN")
            )));
    }
}
