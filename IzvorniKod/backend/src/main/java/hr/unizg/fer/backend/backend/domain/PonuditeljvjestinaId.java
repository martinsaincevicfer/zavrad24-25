package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import org.hibernate.Hibernate;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PonuditeljvjestinaId implements Serializable {
    @Serial
    private static final long serialVersionUID = -8817268335601956436L;
    @NotNull
    @Column(name = "ponuditelj_id", nullable = false)
    private Integer ponuditeljId;

    @NotNull
    @Column(name = "vjestina_id", nullable = false)
    private Integer vjestinaId;

    public Integer getPonuditeljId() {
        return ponuditeljId;
    }

    public void setPonuditeljId(Integer ponuditeljId) {
        this.ponuditeljId = ponuditeljId;
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
        PonuditeljvjestinaId entity = (PonuditeljvjestinaId) o;
        return Objects.equals(this.vjestinaId, entity.vjestinaId) &&
                Objects.equals(this.ponuditeljId, entity.ponuditeljId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vjestinaId, ponuditeljId);
    }

}