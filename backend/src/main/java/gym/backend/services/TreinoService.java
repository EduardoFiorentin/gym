package gym.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.models.Treino;
import gym.backend.repository.TreinoRepository;

@Service
public class TreinoService {
   
    @Autowired
    private TreinoRepository treinoRepository;


    public List<TreinoResponseDTO> getAllTreinosByUser(String username) {

        List<Treino> treinos = treinoRepository.findByUsername(username);
        System.out.println("Treinos encontrados: "+treinos.toString());
        return treinos.stream().map(TreinoResponseDTO::toDTO).collect(Collectors.toList());
    }

}
