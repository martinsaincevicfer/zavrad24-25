package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "korisnikuloga")
public class Korisnikuloga {
    @EmbeddedId
    private KorisnikulogaId id;

    @MapsId("korisnikId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @MapsId("ulogaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "uloga_id", nullable = false)
    private Uloga uloga;

    public KorisnikulogaId getId() {
        return id;
    }

    public void setId(KorisnikulogaId id) {
        this.id = id;
    }

    public Korisnik getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Korisnik korisnik) {
        this.korisnik = korisnik;
    }

    public Uloga getUloga() {
        return uloga;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

}