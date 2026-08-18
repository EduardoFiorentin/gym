package gym.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.models.Exercicio;
import gym.backend.models.Treinamento;
import gym.backend.models.Treino;
import gym.backend.models.UnMedida;
import gym.backend.models.User;
import gym.backend.repository.ExercicioRepository;
import gym.backend.repository.SerieRepository;
import gym.backend.repository.TreinamentoRepository;
import gym.backend.repository.TreinoRepository;
import gym.backend.repository.UnMedidaRepository;
import gym.backend.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TreinamentoControllerSerieCreateValidationTest {

    private static final String AUTHENTICATED_LOGIN = "serie-create-validation";
    private static final UUID DEFAULT_UN_MEDIDA_ID = UUID.fromString("c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private TreinamentoRepository treinamentoRepository;

    @Autowired
    private SerieRepository serieRepository;

    @Autowired
    private UnMedidaRepository unMedidaRepository;

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void aceitaMagnitudeZero() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPayload(fixture.exercicio().getId(), "0")))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.magnitude").value(0))
            .andExpect(jsonPath("$.execucoes").value(10));

        assertThat(serieRepository.findByTreinamentoIdAndTreinamentoTreinoUserLoginOrderByCreatedAtAsc(
            fixture.treinamento().getId(),
            AUTHENTICATED_LOGIN
        )).hasSize(1);
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void aceitaMagnitudePositiva() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPayload(fixture.exercicio().getId(), "12.50")))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.magnitude").value(12.50))
            .andExpect(jsonPath("$.execucoes").value(10));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaMagnitudeNegativa() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(validPayload(fixture.exercicio().getId(), "-1")))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("A magnitude nao pode ser negativa"));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaMagnitudeVazia() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "exercicioId": "%s",
                        "magnitude": "",
                        "execucoes": 10
                    }
                    """.formatted(fixture.exercicio().getId())))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaMagnitudeNaN() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "exercicioId": "%s",
                        "magnitude": NaN,
                        "execucoes": 10
                    }
                    """.formatted(fixture.exercicio().getId())))
            .andExpect(status().isBadRequest());
    }

    private String validPayload(UUID exercicioId, String magnitude) {
        return """
            {
                "exercicioId": "%s",
                "magnitude": %s,
                "execucoes": 10
            }
            """.formatted(exercicioId, magnitude);
    }

    private Fixture createFixture(String login) {
        User user = createUser(login);
        Treino treino = createTreino(user);
        UnMedida unMedida = getDefaultUnMedida();
        Exercicio exercicio = createExercicio(treino, unMedida);
        Treinamento treinamento = createTreinamento(treino);
        return new Fixture(treinamento, exercicio);
    }

    private User createUser(String login) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User();
        user.setLogin(login);
        user.setName("Test User " + suffix);
        user.setEmail("u-" + suffix + "@gym.local");
        user.setPassword("password");
        return userRepository.saveAndFlush(user);
    }

    private Treino createTreino(User user) {
        Treino treino = new Treino();
        treino.setName("Treino " + UUID.randomUUID().toString().substring(0, 8));
        treino.setUser(user);
        return treinoRepository.saveAndFlush(treino);
    }

    private UnMedida getDefaultUnMedida() {
        return unMedidaRepository.findById(DEFAULT_UN_MEDIDA_ID).orElseGet(() -> {
            UnMedida unMedida = new UnMedida();
            unMedida.setId(DEFAULT_UN_MEDIDA_ID);
            unMedida.setName("Quilogramas");
            unMedida.setAbv("kg");
            return unMedidaRepository.saveAndFlush(unMedida);
        });
    }

    private Exercicio createExercicio(Treino treino, UnMedida unMedida) {
        Exercicio exercicio = new Exercicio();
        exercicio.setName("Exercicio " + UUID.randomUUID().toString().substring(0, 8));
        exercicio.setActive(true);
        exercicio.setTreino(treino);
        exercicio.setUnMedida(unMedida);
        return exercicioRepository.saveAndFlush(exercicio);
    }

    private Treinamento createTreinamento(Treino treino) {
        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(Instant.now().minusSeconds(600));
        return treinamentoRepository.saveAndFlush(treinamento);
    }

    private record Fixture(Treinamento treinamento, Exercicio exercicio) {
    }
}
