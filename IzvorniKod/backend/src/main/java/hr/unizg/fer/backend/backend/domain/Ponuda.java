package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "ponuda")
public class Ponuda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ponuda_id", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @ColumnDefault("'aktivna'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @NotNull
    @Column(name = "iznos", nullable = false, precision = 12, scale = 2)
    private BigDecimal iznos;

    @Column(name = "poruka", length = Integer.MAX_VALUE)
    private String poruka;

    @NotNull
    @Column(name = "rok_za_prihvacanje", nullable = false)
    private Instant rokZaPrihvacanje;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "projekt_id", nullable = false)
    private Projekt projekt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ponuditelj_id", nullable = false)
    private Ponuditelj ponuditelj;

    @OneToOne(mappedBy = "ponuda")
    private Ugovor ugovor;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getIznos() {
        return iznos;
    }

    public void setIznos(BigDecimal iznos) {
        this.iznos = iznos;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public Instant getRokZaPrihvacanje() {
        return rokZaPrihvacanje;
    }

    public void setRokZaPrihvacanje(Instant rokZaPrihvacanje) {
        this.rokZaPrihvacanje = rokZaPrihvacanje;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }

    public Ponuditelj getPonuditelj() {
        return ponuditelj;
    }

    public void setPonuditelj(Ponuditelj ponuditelj) {
        this.ponuditelj = ponuditelj;
    }

    public Ugovor getUgovor() {
        return ugovor;
    }

    public void setUgovor(Ugovor ugovor) {
        this.ugovor = ugovor;
    }

}