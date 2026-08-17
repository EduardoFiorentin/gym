package gym.backend.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.controller.dto.ExercicioRequestDTO;
import gym.backend.controller.dto.TreinoDetailsResponseDTO;
import gym.backend.controller.dto.TreinoRequestDTO;
import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.exceptions.BusinessRuleException;
import gym.backend.exceptions.ResourceNotFoundException;
import gym.backend.models.Exercicio;
import gym.backend.models.Treino;
import gym.backend.models.UnMedida;
import gym.backend.models.User;
import gym.backend.repository.ExercicioRepository;
import gym.backend.repository.TreinoRepository;
import gym.backend.repository.UnMedidaRepository;
import gym.backend.repository.UserRepository;

@Service
public class TreinoService {

    private static final UUID DEFAULT_UN_MEDIDA_ID = UUID.fromString("c1c1c1c1-1111-1111-1111-c1c1c1c1c1c1");

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private UnMedidaRepository unMedidaRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TreinoResponseDTO> getAllTreinosByUser(String username) {
        List<Treino> treinos = treinoRepository.findByUsername(username);
        return treinos.stream().map(TreinoResponseDTO::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public TreinoDetailsResponseDTO getTreinoByUser(UUID treinoId, String username) {
        Treino treino = getTreinoEntityByUser(treinoId, username);
        List<Exercicio> exercicios = exercicioRepository
            .findByTreinoIdAndTreinoUserLoginAndActiveTrueOrderByCreatedAtAsc(treinoId, username);
        return TreinoDetailsResponseDTO.toDTO(treino, exercicios);
    }

    @Transactional
    public TreinoDetailsResponseDTO createTreino(String username, TreinoRequestDTO request) {
        User user = userRepository.findEntityByLogin(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        Treino treino = new Treino();
        treino.setName(request.name().trim());
        treino.setUser(user);

        Treino savedTreino = treinoRepository.save(treino);
        UnMedida defaultUnMedida = getDefaultUnMedida();

        List<Exercicio> exercicios = request.exercicios().stream()
            .map(exercicioRequest -> buildExercicio(exercicioRequest, savedTreino, defaultUnMedida))
            .toList();

        List<Exercicio> savedExercicios = exercicioRepository.saveAll(exercicios);
        return TreinoDetailsResponseDTO.toDTO(savedTreino, savedExercicios);
    }

    public Treino getTreinoEntityByUser(UUID treinoId, String username) {
        return treinoRepository.findByIdAndUserLogin(treinoId, username)
            .orElseThrow(() -> new ResourceNotFoundException("Treino nao encontrado."));
    }

    private Exercicio buildExercicio(ExercicioRequestDTO request, Treino treino, UnMedida defaultUnMedida) {
        Exercicio exercicio = new Exercicio();
        exercicio.setName(request.name().trim());
        exercicio.setActive(true);
        exercicio.setTreino(treino);
        exercicio.setUnMedida(resolveUnMedida(request.unMedidaId(), defaultUnMedida));
        return exercicio;
    }

    private UnMedida resolveUnMedida(UUID unMedidaId, UnMedida defaultUnMedida) {
        if (unMedidaId == null) {
            return defaultUnMedida;
        }

        return unMedidaRepository.findById(unMedidaId)
            .orElseThrow(() -> new ResourceNotFoundException("Unidade de medida nao encontrada."));
    }

    private UnMedida getDefaultUnMedida() {
        return unMedidaRepository.findById(DEFAULT_UN_MEDIDA_ID)
            .orElseThrow(() -> new BusinessRuleException("Unidade de medida padrao nao encontrada."));
    }

}
