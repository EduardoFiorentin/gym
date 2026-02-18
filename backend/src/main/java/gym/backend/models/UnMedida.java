package gym.backend.models;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "un_medida")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UnMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(
        nullable = false,
        length = 30,
        updatable = true
    )
    private String name;

    @Column(
        nullable = false,
        length = 10,
        updatable = true
    )
    private String abv;

}
