package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class SlobodnjakvjestinaId implements Serializable {
    private static final long serialVersionUID = 6662435951972509886L;
    @Column(name = "korisnik_id", nullable = false)
    private Integer korisnikId;

    @Column(name = "vjestina_id", nullable = false)
    private Integer vjestinaId;

    public Integer getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(Integer korisnikId) {
        this.korisnikId = korisnikId;
    }

    public Integer getVjestinaId() {
        return vjestinaId;
    }

    public void setVjestinaId(Integer vjestinaId) {
        this.vjestinaId = vjestinaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SlobodnjakvjestinaId entity = (SlobodnjakvjestinaId) o;
        return Objects.equals(this.vjestinaId, entity.vjestinaId) &&
                Objects.equals(this.korisnikId, entity.korisnikId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vjestinaId, korisnikId);
    }

}