package gym.backend.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gym.backend.controller.dto.SerieRequestDTO;
import gym.backend.controller.dto.SerieResponseDTO;
import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.exceptions.BusinessRuleException;
import gym.backend.exceptions.ResourceNotFoundException;
import gym.backend.models.Exercicio;
import gym.backend.models.Serie;
import gym.backend.models.Treinamento;
import gym.backend.models.Treino;
import gym.backend.repository.ExercicioRepository;
import gym.backend.repository.SerieRepository;
import gym.backend.repository.TreinamentoRepository;

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

    @Transactional(readOnly = true)
    public List<TreinamentoResponseDTO> getTreinamentoHistoryByUsernameStartingFrom(String username, Instant timestamp) {
        return treinamentoRepository.getUserTreinamentosStartingFrom(username, timestamp);
    }

    @Transactional
    public TreinamentoResponseDTO startTreinamento(String username, UUID treinoId) {
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
        if (treinamento.getFinishedAt() != null) {
            throw new BusinessRuleException("Nao e possivel registrar series em um treinamento finalizado.");
        }

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

}
