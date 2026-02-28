package gym.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.controller.dto.TreinoResponseDTO;
import gym.backend.repository.TreinoRepository;

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
