package gym.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import gym.backend.repository.UserRepository;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;
    
    @Autowired
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);
        
        
        if (token != null) {
            System.out.println("Token recuperado " + token.toString());
            var login = tokenService.validateToken(token);
            UserDetails user = userRepository.findByLogin(login);

            var authorities = user.getAuthorities().stream()
                .map(r -> new SimpleGrantedAuthority(r.toString()))
                .toList();

            System.out.println("Procurando usuario da autenticação");
            if (user != null) {
                System.out.println("Usuario da autenticação encontrado: " + user.toString());
                var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                System.out.println("Objeto de autenticação: " + authentication.toString());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        else System.out.println("Token não encontrado!");
        
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7);
    }
}