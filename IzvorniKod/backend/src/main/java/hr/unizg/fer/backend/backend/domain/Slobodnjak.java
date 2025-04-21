package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "slobodnjak", uniqueConstraints = {
        @UniqueConstraint(name = "slobodnjak_slobodnjak_id_key", columnNames = {"slobodnjak_id"})
})
public class Slobodnjak {
    @Id
    @Column(name = "korisnik_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ColumnDefault("nextval('slobodnjak_slobodnjak_id_seq')")
    @Column(name = "slobodnjak_id", nullable = false)
    private Integer slobodnjakId;

    @Column(name = "kratki_opis", length = 500)
    private String kratkiOpis;

    @Column(name = "edukacija", length = Integer.MAX_VALUE)
    private String edukacija;

    @Column(name = "iskustvo", length = Integer.MAX_VALUE)
    private String iskustvo;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @OneToMany(mappedBy = "korisnik")
    private Set<Prijava> prijave = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
    name = "slobodnjakvjestina",
    joinColumns = {
        @JoinColumn(name = "korisnik_id")
    },
    inverseJoinColumns = {
        @JoinColumn(name = "vjestina_id")
    }
    )
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

    public Integer getSlobodnjakId() {
        return slobodnjakId;
    }

    public void setSlobodnjakId(Integer slobodnjakId) {
        this.slobodnjakId = slobodnjakId;
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

    public Set<Prijava> getPrijave() {
        return prijave;
    }

    public void setPrijave(Set<Prijava> prijave) {
        this.prijave = prijave;
    }

    public Set<Vjestina> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<Vjestina> vjestine) {
        this.vjestine = vjestine;
    }

}