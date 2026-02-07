package gym.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            // Roles and permissions define
            // role         -> grupo de usuários (master, gerente, vendedor, etc) - grupo de authority
            // authority    -> cadastrar usuário, acessar relatorio x
            .authorizeHttpRequests(customizer -> {
                customizer.requestMatchers("/public").permitAll();
                customizer.requestMatchers("/master").hasRole("MASTER");
                customizer.requestMatchers("/private").hasRole("ADMIN");
                customizer.anyRequest().authenticated();
            })
            
            // default way of spring authentication - form + basic
            .httpBasic(Customizer.withDefaults())
            .formLogin(Customizer.withDefaults())

            // adiciona um authenticationProvider
            // .authenticationProvider(masterPassAuthenticationProvider)
            .build();
    }

    // Especifica ao spring de onde vem os usuários
    // Tem um método que pode ser implementado que pega usuário de outro lugar
    // Spring faz a verificação automaticamente de senha e usuário, este método 
    // apenas precisa retornar um UserDetails 
    @Bean
    public UserDetailsService userDetailsService() {

        UserDetails commomUser = User
            .builder()
            .username("user")
            .password(passwordEncoder().encode("123"))
            .roles("USER")
            .build();
        
        UserDetails adminUser = User
            .builder()
            .username("admin")
            .password(passwordEncoder().encode("123"))
            .roles("USER", "ADMIN")
            .build();

        return new InMemoryUserDetailsManager(commomUser, adminUser);
    }

    // Especificação de como a senha deve ser encriptada e decriptada
    // usa este encoder toda vez que for gravar ou verificar uma senha
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
