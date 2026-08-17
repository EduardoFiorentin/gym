package gym.backend.controller;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.models.Exercicio;
import gym.backend.models.Serie;
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
class TreinamentoControllerPreviousExercisePerformanceTest {

    private static final String AUTHENTICATED_LOGIN = "previous-performance-owner";
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
    void retornaNoContentQuandoNaoExisteExecucaoAnterior() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void retornaUmaExecucaoAnterior() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);
        Treinamento treinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(7200),
            Instant.now().minusSeconds(3600)
        );
        Serie firstSerie = createSerie(treinamento, fixture.exercicio(), BigDecimal.valueOf(20), 8);
        Serie secondSerie = createSerie(treinamento, fixture.exercicio(), BigDecimal.valueOf(25), 6);
        List<Serie> expectedSeries = orderedSeries(List.of(firstSerie, secondSerie));

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.treinamentoId").value(treinamento.getId().toString()))
            .andExpect(jsonPath("$.exercicioId").value(fixture.exercicio().getId().toString()))
            .andExpect(jsonPath("$.startedAt").value(notNullValue()))
            .andExpect(jsonPath("$.finishedAt").value(notNullValue()))
            .andExpect(jsonPath("$.series.length()").value(2))
            .andExpect(jsonPath("$.series[0].id").value(expectedSeries.get(0).getId().toString()))
            .andExpect(jsonPath("$.series[1].id").value(expectedSeries.get(1).getId().toString()));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void retornaExecucaoMaisRecenteQuandoExistemVarias() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);
        Treinamento olderTreinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(10800),
            Instant.now().minusSeconds(7200)
        );
        createSerie(olderTreinamento, fixture.exercicio(), BigDecimal.valueOf(10), 10);

        Treinamento latestTreinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(5400),
            Instant.now().minusSeconds(1800)
        );
        Serie latestSerie = createSerie(latestTreinamento, fixture.exercicio(), BigDecimal.valueOf(30), 12);

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.treinamentoId").value(latestTreinamento.getId().toString()))
            .andExpect(jsonPath("$.series.length()").value(1))
            .andExpect(jsonPath("$.series[0].id").value(latestSerie.getId().toString()))
            .andExpect(jsonPath("$.series[0].magnitude").value(30.00))
            .andExpect(jsonPath("$.series[0].execucoes").value(12));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void ignoraTreinamentoAtivo() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);
        Treinamento finishedTreinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(7200),
            Instant.now().minusSeconds(3600)
        );
        Serie finishedSerie = createSerie(finishedTreinamento, fixture.exercicio(), BigDecimal.valueOf(16), 10);

        Treinamento activeTreinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(600),
            null
        );
        createSerie(activeTreinamento, fixture.exercicio(), BigDecimal.valueOf(99), 1);

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.treinamentoId").value(finishedTreinamento.getId().toString()))
            .andExpect(jsonPath("$.series.length()").value(1))
            .andExpect(jsonPath("$.series[0].id").value(finishedSerie.getId().toString()))
            .andExpect(jsonPath("$.series[0].magnitude").value(16.00));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void ignoraTreinamentoDeOutroUsuario() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);
        User otherUser = createUser("previous-performance-other-user");
        Treino otherTreino = createTreino(otherUser);
        Treinamento otherTreinamento = createTreinamento(
            otherTreino,
            Instant.now().minusSeconds(7200),
            Instant.now().minusSeconds(3600)
        );
        createSerie(otherTreinamento, fixture.exercicio(), BigDecimal.valueOf(99), 1);

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void retornaNotFoundParaExercicioDeOutroUsuario() throws Exception {
        Fixture otherUserFixture = createFixture("previous-performance-other-exercise");

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", otherUserFixture.exercicio().getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void preservaSeriesCorretasEOrdenadas() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN);
        Exercicio otherExercicio = createExercicio(fixture.treino(), getDefaultUnMedida());
        Treinamento treinamento = createTreinamento(
            fixture.treino(),
            Instant.now().minusSeconds(7200),
            Instant.now().minusSeconds(3600)
        );
        Serie firstSerie = createSerie(treinamento, fixture.exercicio(), BigDecimal.valueOf(15), 8);
        createSerie(treinamento, otherExercicio, BigDecimal.valueOf(999), 1);
        Serie secondSerie = createSerie(treinamento, fixture.exercicio(), BigDecimal.valueOf(20), 10);
        Serie thirdSerie = createSerie(treinamento, fixture.exercicio(), BigDecimal.valueOf(25), 12);
        List<Serie> expectedSeries = orderedSeries(List.of(firstSerie, secondSerie, thirdSerie));

        mockMvc.perform(get("/exercicios/{exercicioId}/previous-performance", fixture.exercicio().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.treinamentoId").value(treinamento.getId().toString()))
            .andExpect(jsonPath("$.series.length()").value(3))
            .andExpect(jsonPath("$.series[0].id").value(expectedSeries.get(0).getId().toString()))
            .andExpect(jsonPath("$.series[0].exercicioId").value(fixture.exercicio().getId().toString()))
            .andExpect(jsonPath("$.series[1].id").value(expectedSeries.get(1).getId().toString()))
            .andExpect(jsonPath("$.series[1].exercicioId").value(fixture.exercicio().getId().toString()))
            .andExpect(jsonPath("$.series[2].id").value(expectedSeries.get(2).getId().toString()))
            .andExpect(jsonPath("$.series[2].exercicioId").value(fixture.exercicio().getId().toString()));
    }

    private Fixture createFixture(String login) {
        User user = createUser(login);
        Treino treino = createTreino(user);
        Exercicio exercicio = createExercicio(treino, getDefaultUnMedida());
        return new Fixture(treino, exercicio);
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

    private Treinamento createTreinamento(Treino treino, Instant startedAt, Instant finishedAt) {
        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(startedAt);
        treinamento.setFinishedAt(finishedAt);
        return treinamentoRepository.saveAndFlush(treinamento);
    }

    private Serie createSerie(Treinamento treinamento, Exercicio exercicio, BigDecimal magnitude, Integer execucoes) {
        Serie serie = new Serie();
        serie.setTreinamento(treinamento);
        serie.setExercicio(exercicio);
        serie.setMagnitude(magnitude);
        serie.setExecucoes(execucoes);
        return serieRepository.saveAndFlush(serie);
    }

    private List<Serie> orderedSeries(List<Serie> series) {
        return series.stream()
            .sorted(Comparator.comparing(Serie::getCreatedAt).thenComparing(Serie::getId))
            .toList();
    }

    private record Fixture(Treino treino, Exercicio exercicio) {
    }
}
