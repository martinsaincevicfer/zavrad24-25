package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "ponuda")
public class Ponuda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ponuda_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "klijent_id", nullable = false)
    private Korisnik klijent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "honorarac_id", nullable = false)
    private Honorarac honorarac;

    @Column(name = "naziv", nullable = false, length = 100)
    private String naziv;

    @Column(name = "opis", length = Integer.MAX_VALUE)
    private String opis;

    @Column(name = "budzet", nullable = false, precision = 12, scale = 2)
    private BigDecimal budzet;

    @Column(name = "rok", nullable = false)
    private LocalDate rok;

    @ColumnDefault("'poslana'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Korisnik getKlijent() {
        return klijent;
    }

    public void setKlijent(Korisnik klijent) {
        this.klijent = klijent;
    }

    public Honorarac getHonorarac() {
        return honorarac;
    }

    public void setHonorarac(Honorarac honorarac) {
        this.honorarac = honorarac;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public BigDecimal getBudzet() {
        return budzet;
    }

    public void setBudzet(BigDecimal budzet) {
        this.budzet = budzet;
    }

    public LocalDate getRok() {
        return rok;
    }

    public void setRok(LocalDate rok) {
        this.rok = rok;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

}