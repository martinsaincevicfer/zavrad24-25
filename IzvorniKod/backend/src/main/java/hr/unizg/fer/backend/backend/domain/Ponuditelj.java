package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "ponuditelj")
public class Ponuditelj {
    @Id
    @Column(name = "korisnik_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @Size(max = 500)
    @NotNull
    @Column(name = "kratki_opis", nullable = false, length = 500)
    private String kratkiOpis;

    @NotNull
    @Column(name = "edukacija", nullable = false, length = Integer.MAX_VALUE)
    private String edukacija;

    @NotNull
    @Column(name = "iskustvo", nullable = false, length = Integer.MAX_VALUE)
    private String iskustvo;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @OneToMany(mappedBy = "ponuditelj")
    private Set<Ponuda> ponude = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(name = "ponuditeljvjestina",
            joinColumns = @JoinColumn(name = "ponuditelj_id"),
            inverseJoinColumns = @JoinColumn(name = "vjestina_id"))
    private Set<Vjestina> vjestine = new LinkedHashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public String getKratkiOpis() {
        return kratkiOpis;
    }

    public void setKratkiOpis(String kratkiOpis) {
        this.kratkiOpis = kratkiOpis;
    }

    public String getEdukacija() {
        return edukacija;
    }

    public void setEdukacija(String edukacija) {
        this.edukacija = edukacija;
    }

    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
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

}