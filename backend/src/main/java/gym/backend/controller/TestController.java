package gym.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.SerieResponseDTO;
import gym.backend.controller.dto.TreinamentoResponseDTO;
import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.exceptions.BusinessRuleException;
import gym.backend.exceptions.UnauthorizedActionException;
import gym.backend.models.Exercicio;
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

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private TreinoRepository treinoRepository;

    // @Autowired
    // private UserRepository userRepository;

    // @Autowired
    // private UnMedidaRepository unMedidaRepository;

    // @Autowired
    // private ExercicioRepository exercicioRepository;

    // @Autowired
    // private TreinamentoRepository treinamentoRepository;

    // @Autowired
    // private SerieRepository serieRepository;

    @GetMapping("/tests")
    public ResponseEntity<Object> getMethodName() {

        // throw new BusinessRuleException("Teste de violação de regra de negocio!");


        // Teste user e treinos 
        // System.out.println(treinoRepository.findByName("B - Pernas"));
        // User user = (User) userRepository.findByLogin("eduardo");
        // System.out.println(user.getTreinos().toString());

        // // teste unidade de medidas
        // List<UnMedida> unMedida = unMedidaRepository.findAll();
        // System.out.println(unMedida.toString());

        // // teste Exercicio 
        // List<Exercicio> ex = exercicioRepository.findAll();

        // System.out.println("Teste exercicio:");
        // System.out.println(ex.toString());

        // System.out.println(ex.toString());
        // System.out.println((ex.stream().map(e -> e.getTreino()).collect(Collectors.toList()).toString()));

        // List<Treinamento> treinamentos = treinamentoRepository.findAll();
        // List<TreinamentoResponseDTO> treinamentoDto = treinamentos
        //     .stream()
        //     .map(TreinamentoResponseDTO::toDto)
        //     .collect(Collectors.toList());
        

        // List<SerieResponseDTO> seriesDto = serieRepository.findAll()
        //     .stream()
        //     .map(SerieResponseDTO::toDTO)
        //     .collect(Collectors.toList());

        List<TreinoResponseDTO> treinos = treinoRepository.findAll()
            .stream()
            .map(TreinoResponseDTO::toDTO)
            .collect(Collectors.toList());

        try {
            Thread.sleep(3000);
        }
        catch(InterruptedException ex) {
            System.out.println("Exception desgraçada");
        }

        return ResponseEntity.ok(treinos);
    }
    
}
