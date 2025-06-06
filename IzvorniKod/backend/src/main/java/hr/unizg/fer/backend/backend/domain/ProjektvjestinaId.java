package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProjektvjestinaId implements Serializable {
    @Serial
    private static final long serialVersionUID = -1424637783673817746L;
    @NotNull
    @Column(name = "vjestina_id", nullable = false)
    private Integer vjestinaId;

    @NotNull
    @Column(name = "projekt_id", nullable = false)
    private Integer projektId;

    public Integer getVjestinaId() {
        return vjestinaId;
    }

    public void setVjestinaId(Integer vjestinaId) {
        this.vjestinaId = vjestinaId;
    }

    public Integer getProjektId() {
        return projektId;
    }

    public void setProjektId(Integer projektId) {
        this.projektId = projektId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProjektvjestinaId entity = (ProjektvjestinaId) o;
        return Objects.equals(this.projektId, entity.projektId) &&
                Objects.equals(this.vjestinaId, entity.vjestinaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projektId, vjestinaId);
    }

}