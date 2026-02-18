package gym.backend.models;

import java.sql.Timestamp;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "treinamento")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Treinamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "treino_id", foreignKey = @ForeignKey(name = "fk_treino_treinamento"))
    private Treino treino;

    @Column(name = "started_at", nullable = false)
    private Timestamp startedAt;

    @Column(name = "finished_at", nullable = true)
    private Timestamp finishedAt;
}
