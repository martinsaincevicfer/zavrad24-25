package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "slobodnjakvjestina")
public class Slobodnjakvjestina {
    @EmbeddedId
    private SlobodnjakvjestinaId id;

    @MapsId("korisnikId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Slobodnjak korisnik;

    @MapsId("vjestinaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vjestina_id", nullable = false)
    private Vjestina vjestina;

    public SlobodnjakvjestinaId getId() {
        return id;
    }

    public void setId(SlobodnjakvjestinaId id) {
        this.id = id;
    }

    public Slobodnjak getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Slobodnjak korisnik) {
        this.korisnik = korisnik;
    }

    public Vjestina getVjestina() {
        return vjestina;
    }

    public void setVjestina(Vjestina vjestina) {
        this.vjestina = vjestina;
    }

}