package gym.backend.controller;

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

import gym.backend.models.Treinamento;
import gym.backend.models.Treino;
import gym.backend.models.User;
import gym.backend.repository.TreinamentoRepository;
import gym.backend.repository.TreinoRepository;
import gym.backend.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TreinamentoControllerHistoryFilterTest {

    private static final String AUTHENTICATED_LOGIN = "history-filter-owner";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private TreinamentoRepository treinamentoRepository;

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void payloadValidoRetornaHistorico() throws Exception {
        User user = createUser(AUTHENTICATED_LOGIN);
        Treino treino = createTreino(user);
        Instant startedAt = Instant.now().minusSeconds(3600);
        Treinamento treinamento = createTreinamento(treino, startedAt);

        mockMvc.perform(post("/treinos/history").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"startFrom\":\"" + startedAt.minusSeconds(60) + "\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value(treinamento.getId().toString()))
            .andExpect(jsonPath("$[0].treinoId").value(treino.getId().toString()))
            .andExpect(jsonPath("$[0].treinoName").value(treino.getName()));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaStartFromAusente() throws Exception {
        mockMvc.perform(post("/treinos/history").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("startFrom e obrigatorio."))
            .andExpect(jsonPath("$.path").value("/treinos/history"));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaStartFromFuturo() throws Exception {
        mockMvc.perform(post("/treinos/history").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"startFrom\":\"" + Instant.now().plusSeconds(300) + "\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("startFrom nao pode estar no futuro."))
            .andExpect(jsonPath("$.path").value("/treinos/history"));
    }

    @Test
    @WithMockUser(username = AUTHENTICATED_LOGIN)
    void rejeitaPayloadAusente() throws Exception {
        mockMvc.perform(post("/treinos/history").with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Payload da requisicao invalido ou ausente."))
            .andExpect(jsonPath("$.path").value("/treinos/history"));
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

    private Treinamento createTreinamento(Treino treino, Instant startedAt) {
        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(startedAt);
        treinamento.setFinishedAt(startedAt.plusSeconds(1800));
        return treinamentoRepository.saveAndFlush(treinamento);
    }
}
