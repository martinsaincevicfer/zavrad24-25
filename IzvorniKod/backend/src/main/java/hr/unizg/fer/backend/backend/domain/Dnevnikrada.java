package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "dnevnikrada")
public class Dnevnikrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dnevnik_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ugovor_id", nullable = false)
    private Ugovor ugovor;

    @NotNull
    @Column(name = "poruka", nullable = false, length = Integer.MAX_VALUE)
    private String poruka;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_unosa", nullable = false)
    private Instant datumUnosa;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Ugovor getUgovor() {
        return ugovor;
    }

    public void setUgovor(Ugovor ugovor) {
        this.ugovor = ugovor;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public Instant getDatumUnosa() {
        return datumUnosa;
    }

    public void setDatumUnosa(Instant datumUnosa) {
        this.datumUnosa = datumUnosa;
    }

}