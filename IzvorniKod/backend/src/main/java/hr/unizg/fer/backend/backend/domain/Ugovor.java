package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "ugovor", uniqueConstraints = {
        @UniqueConstraint(name = "ugovor_prijava_id_key", columnNames = {"prijava_id"})
})
public class Ugovor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ugovor_id", nullable = false)
    private Integer id;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "datum_pocetka", nullable = false)
    private LocalDate datumPocetka;

    @Column(name = "datum_zavrsetka", nullable = false)
    private LocalDate datumZavrsetka;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "prijava_id", nullable = false)
    private Prijava prijava;

    @OneToMany(mappedBy = "ugovor")
    private Set<Recenzija> recenzije = new LinkedHashSet<>();

    @OneToMany(mappedBy = "ugovor")
    private Set<Rezultat> rezultati = new LinkedHashSet<>();

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

    public LocalDate getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(LocalDate datumPocetka) {
        this.datumPocetka = datumPocetka;
    }

    public LocalDate getDatumZavrsetka() {
        return datumZavrsetka;
    }

    public void setDatumZavrsetka(LocalDate datumZavrsetka) {
        this.datumZavrsetka = datumZavrsetka;
    }

    public Prijava getPrijava() {
        return prijava;
    }

    public void setPrijava(Prijava prijava) {
        this.prijava = prijava;
    }

    public Set<Recenzija> getRecenzije() {
        return recenzije;
    }

    public void setRecenzije(Set<Recenzija> recenzije) {
        this.recenzije = recenzije;
    }

    public Set<Rezultat> getRezultati() {
        return rezultati;
    }

    public void setRezultati(Set<Rezultat> rezultati) {
        this.rezultati = rezultati;
    }

}