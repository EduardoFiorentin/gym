package gym.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println("Iniciando versão 0.0.1");
		SpringApplication.run(BackendApplication.class, args);
	}

}
