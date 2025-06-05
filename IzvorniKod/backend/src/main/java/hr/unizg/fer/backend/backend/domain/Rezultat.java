package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "rezultat")
public class Rezultat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rezultat_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ugovor_id", nullable = false)
    private Ugovor ugovor;

    @Column(name = "naziv")
    private String naziv;

    @Column(name = "datoteka_url", nullable = false, length = Integer.MAX_VALUE)
    private String datotekaUrl;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_uploada", nullable = false)
    private Instant datumUploada;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Ugovor getUgovor() {
        return ugovor;
    }

    public void setUgovor(Ugovor ugovor) {
        this.ugovor = ugovor;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getDatotekaUrl() {
        return datotekaUrl;
    }

    public void setDatotekaUrl(String datotekaUrl) {
        this.datotekaUrl = datotekaUrl;
    }

    public Instant getDatumUploada() {
        return datumUploada;
    }

    public void setDatumUploada(Instant datumUploada) {
        this.datumUploada = datumUploada;
    }

}