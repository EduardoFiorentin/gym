package gym.backend.models;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "serie", schema = "public")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Serie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "treinamento_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_treinamento_serie")
    )
    private Treinamento treinamento; 

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "exercicio_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_exercicio_serie")
    )
    private Exercicio exercicio;

    @Column(name = "magnitude", nullable = false, precision = 5, scale = 2)
    private BigDecimal magnitude;

    @Column(name = "execucoes", nullable = false)
    private Integer execucoes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;
}