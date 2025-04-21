package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "korisnik", uniqueConstraints = {
        @UniqueConstraint(name = "korisnik_email_key", columnNames = {"email"})
})
public class Korisnik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('korisnik_korisnik_id_seq')")
    @Column(name = "korisnik_id", nullable = false)
    private Integer id;

    @Column(name = "tip", nullable = false, length = 20)
    private String tip;

    @Column(name = "uloga", nullable = false, length = 20)
    private String uloga;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "lozinka", nullable = false)
    private String lozinka;

    @Column(name = "ime", length = 100)
    private String ime;

    @Column(name = "prezime", length = 100)
    private String prezime;

    @Column(name = "naziv", nullable = false, length = 100)
    private String naziv;

    @Column(name = "adresa", length = Integer.MAX_VALUE)
    private String adresa;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @OneToMany(mappedBy = "korisnik")
    private Set<Projekt> projekti = new LinkedHashSet<>();

    @OneToOne(mappedBy = "korisnik")
    private Slobodnjak slobodnjak;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public String getUloga() {
        return uloga;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLozinka() {
        return lozinka;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Set<Projekt> getProjekti() {
        return projekti;
    }

    public void setProjekti(Set<Projekt> projekti) {
        this.projekti = projekti;
    }

    public Slobodnjak getSlobodnjak() {
        return slobodnjak;
    }

    public void setSlobodnjak(Slobodnjak slobodnjak) {
        this.slobodnjak = slobodnjak;
    }

}