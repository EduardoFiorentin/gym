package gym.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
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
class TreinamentoControllerFinalizationTest {

    private static final String AUTHENTICATED_LOGIN = "training-finalizer";
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
    void finalizaTreinamentoAtivo() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, false);

        mockMvc.perform(put("/treinamentos/{treinamentoId}/finish", fixture.treinamento().getId()).with(csrf()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(fixture.treinamento().getId().toString()))
            .andExpect(jsonPath("$.finishedAt").isNotEmpty());

        Treinamento treinamento = treinamentoRepository.findById(fixture.treinamento().getId()).orElseThrow();
        assertThat(treinamento.getFinishedAt()).isNotNull();
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaFinalizarTreinamentoJaFinalizadoSemAlterarTimestamp() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, true);
        Instant finishedAt = fixture.treinamento().getFinishedAt();

        mockMvc.perform(put("/treinamentos/{treinamentoId}/finish", fixture.treinamento().getId()).with(csrf()))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.message").value("Treinamento ja esta finalizado."));

        Treinamento treinamento = treinamentoRepository.findById(fixture.treinamento().getId()).orElseThrow();
        assertThat(treinamento.getFinishedAt()).isEqualTo(finishedAt);
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void outroUsuarioNaoFinalizaTreinamento() throws Exception {
        Fixture otherUserFixture = createFixture("training-finalizer-other", false);

        mockMvc.perform(put("/treinamentos/{treinamentoId}/finish", otherUserFixture.treinamento().getId()).with(csrf()))
            .andExpect(status().isNotFound());

        Treinamento treinamento = treinamentoRepository.findById(otherUserFixture.treinamento().getId()).orElseThrow();
        assertThat(treinamento.getFinishedAt()).isNull();
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void bloqueiaAdicionarSerieDepoisDeFinalizado() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, true);

        mockMvc.perform(post("/treinamentos/{treinamentoId}/series", fixture.treinamento().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "exercicioId": "%s",
                        "magnitude": 20.00,
                        "execucoes": 10
                    }
                    """.formatted(fixture.exercicio().getId())))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.message").value("Nao e possivel registrar series em um treinamento finalizado."));

        assertThat(serieRepository.findByTreinamentoIdAndTreinamentoTreinoUserLoginOrderByCreatedAtAsc(
            fixture.treinamento().getId(),
            AUTHENTICATED_LOGIN
        )).hasSize(1);
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void bloqueiaEditarSerieDepoisDeFinalizado() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, true);

        mockMvc.perform(put("/treinamentos/{treinamentoId}/series/{serieId}", fixture.treinamento().getId(), fixture.serie().getId()).with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"magnitude\":25.00,\"execucoes\":12}"))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.message").value("Nao e possivel alterar series em um treinamento finalizado."));

        Serie serie = serieRepository.findById(fixture.serie().getId()).orElseThrow();
        assertThat(serie.getMagnitude()).isEqualByComparingTo(BigDecimal.TEN);
        assertThat(serie.getExecucoes()).isEqualTo(8);
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void bloqueiaRemoverSerieDepoisDeFinalizado() throws Exception {
        Fixture fixture = createFixture(AUTHENTICATED_LOGIN, true);

        mockMvc.perform(delete("/treinamentos/{treinamentoId}/series/{serieId}", fixture.treinamento().getId(), fixture.serie().getId()).with(csrf()))
            .andExpect(status().isUnprocessableEntity())
            .andExpect(jsonPath("$.message").value("Nao e possivel remover series em um treinamento finalizado."));

        assertThat(serieRepository.existsById(fixture.serie().getId())).isTrue();
    }

    private Fixture createFixture(String login, boolean finished) {
        User user = createUser(login);
        Treino treino = createTreino(user);
        UnMedida unMedida = getDefaultUnMedida();
        Exercicio exercicio = createExercicio(treino, unMedida);
        Treinamento treinamento = createTreinamento(treino, finished);
        Serie serie = createSerie(treinamento, exercicio);
        return new Fixture(treinamento, exercicio, serie);
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

    private Treinamento createTreinamento(Treino treino, boolean finished) {
        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(Instant.now().minusSeconds(600));
        if (finished) {
            treinamento.setFinishedAt(Instant.now().minusSeconds(60));
        }
        return treinamentoRepository.saveAndFlush(treinamento);
    }

    private Serie createSerie(Treinamento treinamento, Exercicio exercicio) {
        Serie serie = new Serie();
        serie.setTreinamento(treinamento);
        serie.setExercicio(exercicio);
        serie.setMagnitude(BigDecimal.TEN);
        serie.setExecucoes(8);
        return serieRepository.saveAndFlush(serie);
    }

    private record Fixture(Treinamento treinamento, Exercicio exercicio, Serie serie) {
    }
}
