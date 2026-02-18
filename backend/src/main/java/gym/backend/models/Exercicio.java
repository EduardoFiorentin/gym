package gym.backend.models;

import java.sql.Timestamp;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = "exercicio")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Exercicio {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "inativated_at", nullable = true)
    private Timestamp inativatedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = true)
    private Timestamp updatedAt;
    
    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "treino_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_treino_exercicio")
    )
    private Treino treino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "un_id", 
        nullable = false, 
        foreignKey = @ForeignKey(name = "fk_un_medida_exercicio")
    )
    private UnMedida unMedida;
}
