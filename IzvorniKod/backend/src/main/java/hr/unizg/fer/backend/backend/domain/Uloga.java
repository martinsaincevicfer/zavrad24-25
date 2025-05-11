package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "uloga", uniqueConstraints = {
        @UniqueConstraint(name = "uloga_naziv_key", columnNames = {"naziv"})
})
public class Uloga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uloga_id", nullable = false)
    private Integer id;

    @Column(name = "naziv", nullable = false, length = 50)
    private String naziv;

    @ManyToMany(mappedBy = "uloge")
    private Set<Korisnik> korisnici = new LinkedHashSet<>();

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

    public Set<Korisnik> getKorisnici() {
        return korisnici;
    }

    public void setKorisnici(Set<Korisnik> korisnici) {
        this.korisnici = korisnici;
    }

}