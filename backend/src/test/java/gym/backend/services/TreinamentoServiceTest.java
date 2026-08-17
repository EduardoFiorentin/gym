package gym.backend.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.exceptions.DuplicateResourceException;
import gym.backend.models.Treinamento;
import gym.backend.models.Treino;
import gym.backend.models.User;
import gym.backend.repository.TreinamentoRepository;
import gym.backend.repository.TreinoRepository;
import gym.backend.repository.UserRepository;

@SpringBootTest
@Transactional
class TreinamentoServiceTest {

    @Autowired
    private TreinamentoService treinamentoService;

    @Autowired
    private TreinamentoRepository treinamentoRepository;

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void usuarioSemTreinamentoAtivoConsegueIniciar() {
        User user = createUser();
        Treino treino = createTreino(user);

        TreinamentoResponseDTO response = treinamentoService.startTreinamento(user.getLogin(), treino.getId());

        assertThat(response.id()).isNotNull();
        assertThat(response.treinoId()).isEqualTo(treino.getId());
        assertThat(response.finishedAt()).isNull();
        assertThat(treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(user.getLogin())).hasSize(1);
    }

    @Test
    void mesmoUsuarioNaoConsegueCriarDoisTreinamentosAtivos() {
        User user = createUser();
        Treino treino = createTreino(user);

        treinamentoService.startTreinamento(user.getLogin(), treino.getId());

        assertThatThrownBy(() -> treinamentoService.startTreinamento(user.getLogin(), treino.getId()))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("treinamento ativo");
        assertThat(treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(user.getLogin())).hasSize(1);
    }

    @Test
    void usuariosDiferentesPodemTerSeusPropriosTreinamentosAtivos() {
        User firstUser = createUser();
        User secondUser = createUser();
        Treino firstTreino = createTreino(firstUser);
        Treino secondTreino = createTreino(secondUser);

        TreinamentoResponseDTO firstResponse = treinamentoService.startTreinamento(firstUser.getLogin(), firstTreino.getId());
        TreinamentoResponseDTO secondResponse = treinamentoService.startTreinamento(secondUser.getLogin(), secondTreino.getId());

        assertThat(firstResponse.id()).isNotEqualTo(secondResponse.id());
        assertThat(treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(firstUser.getLogin())).hasSize(1);
        assertThat(treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(secondUser.getLogin())).hasSize(1);
    }

    @Test
    void treinamentoFinalizadoNaoImpedeIniciarUmNovo() {
        User user = createUser();
        Treino treino = createTreino(user);
        Treinamento finishedTreinamento = new Treinamento();
        finishedTreinamento.setTreino(treino);
        finishedTreinamento.setStartedAt(Instant.now().minusSeconds(3600));
        finishedTreinamento.setFinishedAt(Instant.now().minusSeconds(1800));
        treinamentoRepository.saveAndFlush(finishedTreinamento);

        TreinamentoResponseDTO response = treinamentoService.startTreinamento(user.getLogin(), treino.getId());

        assertThat(response.id()).isNotNull();
        assertThat(response.finishedAt()).isNull();
        assertThat(treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(user.getLogin())).hasSize(1);
    }

    @Test
    void getCurrentRetornaDeterministicamenteUnicoTreinamentoAtivo() {
        User user = createUser();
        Treino treino = createTreino(user);
        TreinamentoResponseDTO started = treinamentoService.startTreinamento(user.getLogin(), treino.getId());

        Optional<TreinamentoResponseDTO> current = treinamentoService.getCurrentTreinamento(user.getLogin());

        assertThat(current).isPresent();
        assertThat(current.get().id()).isEqualTo(started.id());
        assertThat(current.get().finishedAt()).isNull();
    }

    private User createUser() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        User user = new User();
        user.setLogin("test-" + suffix);
        user.setName("Test User " + suffix);
        user.setEmail("t-" + suffix + "@gym.local");
        user.setPassword("password");
        return userRepository.saveAndFlush(user);
    }

    private Treino createTreino(User user) {
        Treino treino = new Treino();
        treino.setName("Treino " + UUID.randomUUID().toString().substring(0, 8));
        treino.setUser(user);
        return treinoRepository.saveAndFlush(treino);
    }
}
