package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "honoraracvjestina")
public class Honoraracvjestina {
    @EmbeddedId
    private HonoraracvjestinaId id;

    @MapsId("korisnikId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Honorarac korisnik;

    @MapsId("vjestinaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vjestina_id", nullable = false)
    private Vjestina vjestina;

    public HonoraracvjestinaId getId() {
        return id;
    }

    public void setId(HonoraracvjestinaId id) {
        this.id = id;
    }

    public Honorarac getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(Honorarac korisnik) {
        this.korisnik = korisnik;
    }

    public Vjestina getVjestina() {
        return vjestina;
    }

    public void setVjestina(Vjestina vjestina) {
        this.vjestina = vjestina;
    }

}