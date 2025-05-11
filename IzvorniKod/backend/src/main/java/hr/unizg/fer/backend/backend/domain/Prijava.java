package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "prijava")
public class Prijava {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prijava_id", nullable = false)
    private Integer id;

    @ColumnDefault("'aktivna'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "iznos", nullable = false, precision = 12, scale = 2)
    private BigDecimal iznos;

    @Column(name = "poruka", length = Integer.MAX_VALUE)
    private String poruka;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "projekt_id", nullable = false)
    private Projekt projekt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Slobodnjak korisnik;

    @OneToOne(mappedBy = "prijava")
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

    public Slobodnjak getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Slobodnjak korisnik) {
        this.korisnik = korisnik;
    }

    public Ugovor getUgovor() {
        return ugovor;
    }

    public void setUgovor(Ugovor ugovor) {
        this.ugovor = ugovor;
    }

}