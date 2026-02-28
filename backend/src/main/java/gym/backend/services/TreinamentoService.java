package gym.backend.services;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.repository.TreinamentoRepository;

@Service
public class TreinamentoService {
   
    @Autowired
    private TreinamentoRepository treinamentoRepository;

    public List<TreinamentoResponseDTO> getTreinamentoHistoryByUsernameStartingFrom(String username, LocalDateTime timestamp) {
        return treinamentoRepository.getUserTreinamentosStartingFrom(username, timestamp);
    }

}