package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "projekt")
public class Projekt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "projekt_id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "naziv", nullable = false, length = 100)
    private String naziv;

    @NotNull
    @Column(name = "opis", nullable = false, length = Integer.MAX_VALUE)
    private String opis;

    @NotNull
    @Column(name = "budzet", nullable = false, precision = 12, scale = 2)
    private BigDecimal budzet;

    @NotNull
    @Column(name = "rok_izrade", nullable = false)
    private LocalDate rokIzrade;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "narucitelj_id", nullable = false)
    private Korisnik narucitelj;

    @NotNull
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @OneToMany(mappedBy = "projekt")
    private Set<Ponuda> ponude = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "projektvjestina",
            joinColumns = @JoinColumn(name = "projekt_id"),
            inverseJoinColumns = @JoinColumn(name = "vjestina_id")
    )
    private Set<Vjestina> vjestine = new LinkedHashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public LocalDate getRokIzrade() {
        return rokIzrade;
    }

    public void setRokIzrade(LocalDate rokIzrade) {
        this.rokIzrade = rokIzrade;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Korisnik getNarucitelj() {
        return narucitelj;
    }

    public void setNarucitelj(Korisnik narucitelj) {
        this.narucitelj = narucitelj;
    }

    public Set<Ponuda> getPonude() {
        return ponude;
    }

    public void setPonude(Set<Ponuda> ponude) {
        this.ponude = ponude;
    }

    public Set<Vjestina> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<Vjestina> vjestine) {
        this.vjestine = vjestine;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}