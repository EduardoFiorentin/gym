package gym.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gym.backend.models.User;
import gym.backend.repository.TreinoRepository;
import gym.backend.repository.UserRepository;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private TreinoRepository treinoRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tests")
    public ResponseEntity<String> getMethodName() {

        System.out.println(treinoRepository.findByName("B - Pernas"));
        
        User user = (User) userRepository.findByLogin("eduardo");
        
        System.out.println(user.getTreinos().toString());

        return ResponseEntity.ok("Feito!");
    }
    
}
