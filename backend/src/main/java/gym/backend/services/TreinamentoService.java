package gym.backend.services;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.controller.dto.PreviousExercisePerformanceResponseDTO;
import gym.backend.controller.dto.SerieRequestDTO;
import gym.backend.controller.dto.SerieResponseDTO;
import gym.backend.controller.dto.SerieUpdateRequestDTO;
import gym.backend.controller.dto.TreinamentoDetailsResponseDTO;
import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.exceptions.BusinessRuleException;
import gym.backend.exceptions.DuplicateResourceException;
import gym.backend.exceptions.ResourceNotFoundException;
import gym.backend.models.Exercicio;
import gym.backend.models.Serie;
import gym.backend.models.Treinamento;
import gym.backend.models.Treino;
import gym.backend.repository.ExercicioRepository;
import gym.backend.repository.SerieRepository;
import gym.backend.repository.TreinamentoRepository;
import gym.backend.repository.UserRepository;

@Service
public class TreinamentoService {
   
    @Autowired
    private TreinamentoRepository treinamentoRepository;

    @Autowired
    private TreinoService treinoService;

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private SerieRepository serieRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TreinamentoResponseDTO> getTreinamentoHistoryByUsernameStartingFrom(String username, Instant timestamp) {
        return treinamentoRepository.getUserTreinamentosStartingFrom(username, timestamp);
    }

    @Transactional(readOnly = true)
    public Optional<TreinamentoResponseDTO> getCurrentTreinamento(String username) {
        return getActiveTreinamento(username).map(TreinamentoResponseDTO::toDto);
    }

    @Transactional(readOnly = true)
    public TreinamentoDetailsResponseDTO getTreinamentoDetails(String username, UUID treinamentoId) {
        Treinamento treinamento = treinamentoRepository.findDetailsByIdAndTreinoUserLogin(treinamentoId, username)
            .orElseThrow(() -> new ResourceNotFoundException("Treinamento nao encontrado."));

        List<Exercicio> exercicios = exercicioRepository
            .findByTreinoIdAndTreinoUserLoginOrderByCreatedAtAscIdAsc(treinamento.getTreino().getId(), username);
        List<Serie> series = serieRepository.findDetailsByTreinamentoIdAndTreinoUserLogin(treinamentoId, username);

        return TreinamentoDetailsResponseDTO.toDTO(treinamento, exercicios, series);
    }

    @Transactional(readOnly = true)
    public Optional<PreviousExercisePerformanceResponseDTO> getPreviousExercisePerformance(String username, UUID exercicioId) {
        if (!exercicioRepository.existsByIdAndTreinoUserLogin(exercicioId, username)) {
            throw new ResourceNotFoundException("Exercicio nao encontrado.");
        }

        List<UUID> treinamentoIds = serieRepository
            .findLatestFinishedTreinamentoIdsByExercicioAndUserLogin(exercicioId, username, PageRequest.of(0, 1));

        if (treinamentoIds.isEmpty()) {
            return Optional.empty();
        }

        List<Serie> series = serieRepository.findPreviousPerformanceSeries(treinamentoIds.get(0), exercicioId, username);
        if (series.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(PreviousExercisePerformanceResponseDTO.toDTO(
            exercicioId,
            series.get(0).getTreinamento(),
            series
        ));
    }

    @Transactional
    public TreinamentoResponseDTO startTreinamento(String username, UUID treinoId) {
        lockUserForActiveTreinamento(username);
        if (getActiveTreinamento(username).isPresent()) {
            throw new DuplicateResourceException("Ja existe um treinamento ativo para este usuario.");
        }

        Treino treino = treinoService.getTreinoEntityByUser(treinoId, username);

        Treinamento treinamento = new Treinamento();
        treinamento.setTreino(treino);
        treinamento.setStartedAt(Instant.now());

        Treinamento savedTreinamento = treinamentoRepository.save(treinamento);
        return TreinamentoResponseDTO.toDto(savedTreinamento);
    }

    @Transactional
    public TreinamentoResponseDTO finishTreinamento(String username, UUID treinamentoId) {
        Treinamento treinamento = getTreinamentoEntityByUser(treinamentoId, username);

        if (treinamento.getFinishedAt() == null) {
            treinamento.setFinishedAt(Instant.now());
        }

        return TreinamentoResponseDTO.toDto(treinamentoRepository.save(treinamento));
    }

    @Transactional
    public SerieResponseDTO createSerie(String username, UUID treinamentoId, SerieRequestDTO request) {
        Treinamento treinamento = getTreinamentoEntityByUser(treinamentoId, username);
        ensureTreinamentoAcceptsSerieChanges(treinamento, "registrar");

        Exercicio exercicio = exercicioRepository
            .findByIdAndTreinoIdAndTreinoUserLoginAndActiveTrue(
                request.exercicioId(),
                treinamento.getTreino().getId(),
                username
            )
            .orElseThrow(() -> new ResourceNotFoundException("Exercicio nao encontrado para este treino."));

        Serie serie = new Serie();
        serie.setTreinamento(treinamento);
        serie.setExercicio(exercicio);
        serie.setMagnitude(request.magnitude());
        serie.setExecucoes(request.execucoes());

        return SerieResponseDTO.toDTO(serieRepository.save(serie));
    }

    @Transactional
    public SerieResponseDTO updateSerie(String username, UUID treinamentoId, UUID serieId, SerieUpdateRequestDTO request) {
        Serie serie = serieRepository
            .findByIdAndTreinamentoIdAndTreinamentoTreinoUserLogin(serieId, treinamentoId, username)
            .orElseThrow(() -> new ResourceNotFoundException("Serie nao encontrada."));

        ensureTreinamentoAcceptsSerieChanges(serie.getTreinamento(), "alterar");

        serie.setMagnitude(request.magnitude());
        serie.setExecucoes(request.execucoes());

        return SerieResponseDTO.toDTO(serieRepository.save(serie));
    }

    @Transactional
    public void deleteSerie(String username, UUID treinamentoId, UUID serieId) {
        Serie serie = serieRepository
            .findByIdAndTreinamentoIdAndTreinamentoTreinoUserLogin(serieId, treinamentoId, username)
            .orElseThrow(() -> new ResourceNotFoundException("Serie nao encontrada."));

        ensureTreinamentoAcceptsSerieChanges(serie.getTreinamento(), "remover");

        serieRepository.delete(serie);
    }

    @Transactional(readOnly = true)
    public List<SerieResponseDTO> getSeriesByTreinamento(String username, UUID treinamentoId) {
        getTreinamentoEntityByUser(treinamentoId, username);
        return serieRepository
            .findByTreinamentoIdAndTreinamentoTreinoUserLoginOrderByCreatedAtAsc(treinamentoId, username)
            .stream()
            .map(SerieResponseDTO::toDTO)
            .toList();
    }

    private Treinamento getTreinamentoEntityByUser(UUID treinamentoId, String username) {
        return treinamentoRepository.findByIdAndTreinoUserLogin(treinamentoId, username)
            .orElseThrow(() -> new ResourceNotFoundException("Treinamento nao encontrado."));
    }

    private void ensureTreinamentoAcceptsSerieChanges(Treinamento treinamento, String action) {
        if (treinamento.getFinishedAt() != null) {
            throw new BusinessRuleException("Nao e possivel " + action + " series em um treinamento finalizado.");
        }
    }

    private Optional<Treinamento> getActiveTreinamento(String username) {
        List<Treinamento> activeTreinamentos = treinamentoRepository.findByTreinoUserLoginAndFinishedAtIsNull(username);
        if (activeTreinamentos.size() > 1) {
            throw new BusinessRuleException("Existe mais de um treinamento ativo para este usuario.");
        }

        return activeTreinamentos.stream().findFirst();
    }

    private void lockUserForActiveTreinamento(String username) {
        userRepository.lockByLogin(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));
    }

}
