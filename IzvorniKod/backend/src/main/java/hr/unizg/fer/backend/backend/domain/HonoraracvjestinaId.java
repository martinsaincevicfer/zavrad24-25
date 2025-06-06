package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class HonoraracvjestinaId implements Serializable {
    @Serial
    private static final long serialVersionUID = 4875260667716901650L;
    @NotNull
    @Column(name = "korisnik_id", nullable = false)
    private Integer korisnikId;

    @NotNull
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
        HonoraracvjestinaId entity = (HonoraracvjestinaId) o;
        return Objects.equals(this.vjestinaId, entity.vjestinaId) &&
                Objects.equals(this.korisnikId, entity.korisnikId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vjestinaId, korisnikId);
    }

}