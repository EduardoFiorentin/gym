package gym.backend.config;

import java.util.List;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
// Implementação precisa ser adicionada aos parametros do SecurityFilterChain
// É uma implementação que fornece uma forma de autenticação
// Cada forma de autenticação autorizada tem sua própria implementação de um AuthenticationProvider
public class MasterPassAuthenticationProvider 
implements AuthenticationProvider
{

    // Recebe um Authentication
    // Se retornar um Authentication, é por que este provider autorizou a autenticação
    // Se retornar null ou Exception, é por que não autorizou
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        var login = authentication.getName();
        var pass = authentication.getCredentials().toString();

        if (login.equals("master") && pass.equals("master")) { 

            // retorna um Authentication personalizado
            // autorizado com login e senha
            return new UsernamePasswordAuthenticationToken(
                login, 
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_MASTER"))
            );
        }

        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
        // return true;
    }
    
}
