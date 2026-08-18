package gym.backend.setup;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import gym.backend.models.Role;
import gym.backend.repository.RoleRepository;
import gym.backend.repository.UserRepository;

class BasicDataLoaderProfileTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withUserConfiguration(BasicDataLoader.class, DemoDataLoader.class)
        .withBean(RoleRepository.class, () -> mock(RoleRepository.class))
        .withBean(UserRepository.class, () -> mock(UserRepository.class))
        .withBean(PasswordEncoder.class, () -> mock(PasswordEncoder.class));

    @Test
    void profileProdNaoRegistraLoaderDeUsuariosDemo() {
        contextRunner
            .withPropertyValues("spring.profiles.active=prod")
            .run(context -> {
                assertThat(context).hasBean("seedRequiredRoles");
                assertThat(context).doesNotHaveBean("seedDemoUsers");
            });
    }

    @Test
    void profileDevRegistraLoaderDeUsuariosDemo() {
        contextRunner
            .withPropertyValues("spring.profiles.active=dev")
            .run(context -> {
                assertThat(context).hasBean("seedRequiredRoles");
                assertThat(context).hasBean("seedDemoUsers");
            });
    }

    @Test
    void profileTestRegistraLoaderDeUsuariosDemo() {
        contextRunner
            .withPropertyValues("spring.profiles.active=test")
            .run(context -> {
                assertThat(context).hasBean("seedRequiredRoles");
                assertThat(context).hasBean("seedDemoUsers");
            });
    }

    @Test
    void rolesEstruturaisSaoCriadasDeFormaIdempotente() throws Exception {
        RoleRepository roleRepository = mock(RoleRepository.class);
        Role existingUserRole = new Role();
        existingUserRole.setName(BasicDataLoader.ROLE_USER);

        when(roleRepository.findByName(BasicDataLoader.ROLE_USER)).thenReturn(existingUserRole);
        when(roleRepository.save(argThat(role -> role != null))).thenAnswer(invocation -> invocation.getArgument(0));

        new ApplicationContextRunner()
            .withUserConfiguration(BasicDataLoader.class)
            .withBean(RoleRepository.class, () -> roleRepository)
            .run(context -> context.getBean("seedRequiredRoles", CommandLineRunner.class).run());

        verify(roleRepository).save(argThat(role -> BasicDataLoader.ROLE_ADMIN.equals(role.getName())));
        verify(roleRepository, never()).save(argThat(role -> BasicDataLoader.ROLE_USER.equals(role.getName())));
        verify(roleRepository).save(argThat(role -> BasicDataLoader.ROLE_MANAGER.equals(role.getName())));
    }
}
