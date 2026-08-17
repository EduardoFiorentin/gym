package gym.backend.controller;

import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
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
class TreinamentoControllerDetailsTest {

    private static final String AUTHENTICATED_LOGIN = "training-details-owner";
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
    void usuarioAcessaProprioTreinamento() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, false);

        mockMvc.perform(get("/treinamentos/{treinamentoId}", fixture.treinamento().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(fixture.treinamento().getId().toString()))
            .andExpect(jsonPath("$.startedAt").value(notNullValue()))
            .andExpect(jsonPath("$.finishedAt").value(nullValue()))
            .andExpect(jsonPath("$.treino.id").value(fixture.treino().getId().toString()))
            .andExpect(jsonPath("$.treino.name").value(fixture.treino().getName()))
            .andExpect(jsonPath("$.treino.exercicios.length()").value(2))
            .andExpect(jsonPath("$.series.length()").value(2));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void outroUsuarioNaoAcessaTreinamento() throws Exception {
        Fixture otherUserFixture = createFixture("training-details-other-user", false);

        mockMvc.perform(get("/treinamentos/{treinamentoId}", otherUserFixture.treinamento().getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void retornaNotFoundParaTreinamentoInexistente() throws Exception {
        mockMvc.perform(get("/treinamentos/{treinamentoId}", UUID.randomUUID()))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void mantemOrdemCorretaDeExerciciosESeries() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, false);
        List<Exercicio> expectedExercicios = fixture.exercicios().stream()
            .sorted(Comparator.comparing(Exercicio::getCreatedAt).thenComparing(Exercicio::getId))
            .toList();
        List<Serie> expectedSeries = fixture.series().stream()
            .sorted(Comparator.comparing(Serie::getCreatedAt).thenComparing(Serie::getId))
            .toList();

        mockMvc.perform(get("/treinamentos/{treinamentoId}", fixture.treinamento().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.treino.exercicios[0].id").value(expectedExercicios.get(0).getId().toString()))
            .andExpect(jsonPath("$.treino.exercicios[1].id").value(expectedExercicios.get(1).getId().toString()))
            .andExpect(jsonPath("$.series[0].id").value(expectedSeries.get(0).getId().toString()))
            .andExpect(jsonPath("$.series[0].exercicioId").value(expectedSeries.get(0).getExercicio().getId().toString()))
            .andExpect(jsonPath("$.series[1].id").value(expectedSeries.get(1).getId().toString()))
            .andExpect(jsonPath("$.series[1].exercicioId").value(expectedSeries.get(1).getExercicio().getId().toString()));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void treinamentoFinalizadoERetornadoCorretamente() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, true);

        mockMvc.perform(get("/treinamentos/{treinamentoId}", fixture.treinamento().getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(fixture.treinamento().getId().toString()))
            .andExpect(jsonPath("$.startedAt").value(notNullValue()))
            .andExpect(jsonPath("$.finishedAt").value(notNullValue()))
            .andExpect(jsonPath("$.series.length()").value(2));
    }

    private Fixture createFixture(String login, boolean finished) {
        User user = createUser(login);
        Treino treino = createTreino(user);
        UnMedida unMedida = getDefaultUnMedida();
        Exercicio firstExercicio = createExercicio(treino, unMedida, "Supino");
        Exercicio secondExercicio = createExercicio(treino, unMedida, "Agachamento");
        Treinamento treinamento = createTreinamento(treino, finished);
        Serie firstSerie = createSerie(treinamento, secondExercicio, BigDecimal.valueOf(30), 10);
        Serie secondSerie = createSerie(treinamento, firstExercicio, BigDecimal.valueOf(20), 8);
        return new Fixture(
            treino,
            treinamento,
            List.of(firstExercicio, secondExercicio),
            List.of(firstSerie, secondSerie)
        );
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

    private Exercicio createExercicio(Treino treino, UnMedida unMedida, String name) {
        Exercicio exercicio = new Exercicio();
        exercicio.setName(name + " " + UUID.randomUUID().toString().substring(0, 8));
        exercicio.setActive(true);
        exercicio.setTreino(treino);
        exercicio.setUnMedida(unMedida);
        return exercicioRepository.saveAndFlush(exercicio);
    }

    private Treinamento createTreinamento(Treino treino, boolean finished) {
        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(Instant.now().minusSeconds(3600));
        if (finished) {
            treinamento.setFinishedAt(Instant.now().minusSeconds(300));
        }
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

    private record Fixture(
        Treino treino,
        Treinamento treinamento,
        List<Exercicio> exercicios,
        List<Serie> series
    ) {
    }
}
