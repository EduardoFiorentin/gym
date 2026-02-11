package gym.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import gym.backend.dto.RegisterDTO;
import gym.backend.models.Role;
import gym.backend.models.User;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;

@Service
public class SubscribeService {
    static final String DEFAULT_USER_ROLE = "USER";
    // @Autowired
    // private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Boolean handlCommomUserSubscribe(RegisterDTO data) {
        
        // if(this.userRepository.findByLogin(data.login()) != null) return false;   

        String encryptedPassword = passwordEncoder.encode(data.password());
        
        Role userRole = roleRepository.findByName(DEFAULT_USER_ROLE);

        User newUser = new User();
        newUser.setName(data.name());
        newUser.setEmail(data.email());
        newUser.setLogin(data.login());
        newUser.setPassword(encryptedPassword);
        newUser.getRoles().add(userRole);

        userRepository.save(newUser);
        
        return true;
    }

    // public Boolean isUserDataValidToSubscribe(RegisterDTO data) {
        
    //     // All fields defined
    //     if (isStringNullOrBlank(data.login()))      return false;
    //     if (isStringNullOrBlank(data.password()))   return false;
    //     if (isStringNullOrBlank(data.name()))       return false;
    //     if (isStringNullOrBlank(data.email()))      return false;

    //     // 

    //     if(this.userRepository.findByLogin(data.login()) != null) return false;
    //     return true;
    // }

    // public Boolean isStringNullOrBlank(String str) {
    //     if (str == null)    return true;
    //     if (str.isBlank())  return true;
    //     return false;
    // }
}
