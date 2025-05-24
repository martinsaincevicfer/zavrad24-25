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
    @Column(name = "korisnik_id", nullable = false)
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "lozinka", nullable = false)
    private String lozinka;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false, insertable = false, updatable = false)
    private Instant datumStvaranja;

    @ManyToMany
    @JoinTable(name = "korisnikuloga",
            joinColumns = @JoinColumn(name = "korisnik_id"),
            inverseJoinColumns = @JoinColumn(name = "uloga_id"))
    private Set<Uloga> uloge = new LinkedHashSet<>();

    @OneToOne(mappedBy = "korisnik",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Osoba osoba;

    @OneToMany(mappedBy = "klijent")
    private Set<Ponuda> ponude = new LinkedHashSet<>();

    @OneToMany(mappedBy = "posiljatelj")
    private Set<Poruka> poslanePoruke = new LinkedHashSet<>();

    @OneToMany(mappedBy = "primatelj")
    private Set<Poruka> primljenePoruke = new LinkedHashSet<>();

    @OneToMany(mappedBy = "korisnik")
    private Set<Projekt> projekti = new LinkedHashSet<>();

    @OneToOne(mappedBy = "korisnik")
    private Honorarac honorarac;

    @OneToOne(mappedBy = "korisnik",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Tvrtka tvrtka;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Set<Uloga> getUloge() {
        return uloge;
    }

    public void setUloge(Set<Uloga> uloge) {
        this.uloge = uloge;
    }

    public Osoba getOsoba() {
        return osoba;
    }

    public void setOsoba(Osoba osoba) {
        this.osoba = osoba;
    }

    public Set<Ponuda> getPonude() {
        return ponude;
    }

    public void setPonude(Set<Ponuda> ponude) {
        this.ponude = ponude;
    }

    public Set<Poruka> getPoslanePoruke() {
        return poslanePoruke;
    }

    public void setPoslanePoruke(Set<Poruka> poslanePoruke) {
        this.poslanePoruke = poslanePoruke;
    }

    public Set<Poruka> getPrimljenePoruke() {
        return primljenePoruke;
    }

    public void setPrimljenePoruke(Set<Poruka> primljenePoruke) {
        this.primljenePoruke = primljenePoruke;
    }

    public Set<Projekt> getProjekti() {
        return projekti;
    }

    public void setProjekti(Set<Projekt> projekti) {
        this.projekti = projekti;
    }

    public Honorarac getHonorarac() {
        return honorarac;
    }

    public void setHonorarac(Honorarac honorarac) {
        this.honorarac = honorarac;
    }

    public Tvrtka getTvrtka() {
        return tvrtka;
    }

    public void setTvrtka(Tvrtka tvrtka) {
        this.tvrtka = tvrtka;
    }

}