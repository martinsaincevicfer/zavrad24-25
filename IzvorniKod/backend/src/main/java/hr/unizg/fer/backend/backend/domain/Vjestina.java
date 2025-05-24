package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "vjestina", uniqueConstraints = {
        @UniqueConstraint(name = "vjestina_naziv_key", columnNames = {"naziv"})
})
public class Vjestina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vjestina_id", nullable = false)
    private Integer id;

    @Column(name = "naziv", nullable = false, length = 100)
    private String naziv;

    @Column(name = "kategorija", length = 100)
    private String kategorija;

    @ManyToMany(mappedBy = "vjestine")
    private Set<Projekt> projekti = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "vjestine")
    private Set<Honorarac> honorarci = new LinkedHashSet<>();

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

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    public Set<Projekt> getProjekti() {
        return projekti;
    }

    public void setProjekti(Set<Projekt> projekti) {
        this.projekti = projekti;
    }

    public Set<Honorarac> getHonorarci() {
        return honorarci;
    }

    public void setHonorarci(Set<Honorarac> slobodnjaci) {
        this.honorarci = slobodnjaci;
    }

}