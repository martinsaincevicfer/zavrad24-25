package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @Size(max = 255)
    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Size(max = 255)
    @NotNull
    @Column(name = "lozinka", nullable = false)
    private String lozinka;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_stvaranja", nullable = false)
    private Instant datumStvaranja;

    @OneToOne(mappedBy = "korisnik")
    private Honorarac honorarac;

    @ManyToMany
    @JoinTable(name = "korisnikuloga",
            joinColumns = @JoinColumn(name = "korisnik_id"),
            inverseJoinColumns = @JoinColumn(name = "uloga_id"))
    private Set<Uloga> uloge = new LinkedHashSet<>();

    @OneToOne(mappedBy = "korisnik",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Osoba osoba;

    @OneToMany(mappedBy = "korisnik")
    private Set<Projekt> projekti = new LinkedHashSet<>();

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

    public Honorarac getHonorarac() {
        return honorarac;
    }

    public void setHonorarac(Honorarac honorarac) {
        this.honorarac = honorarac;
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

    public Set<Projekt> getProjekti() {
        return projekti;
    }

    public void setProjekti(Set<Projekt> projekti) {
        this.projekti = projekti;
    }

    public Tvrtka getTvrtka() {
        return tvrtka;
    }

    public void setTvrtka(Tvrtka tvrtka) {
        this.tvrtka = tvrtka;
    }

}