package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class KorisnikulogaId implements Serializable {
    private static final long serialVersionUID = 4251024954191901432L;
    @NotNull
    @Column(name = "korisnik_id", nullable = false)
    private Integer korisnikId;

    @NotNull
    @Column(name = "uloga_id", nullable = false)
    private Integer ulogaId;

    public Integer getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(Integer korisnikId) {
        this.korisnikId = korisnikId;
    }

    public Integer getUlogaId() {
        return ulogaId;
    }

    public void setUlogaId(Integer ulogaId) {
        this.ulogaId = ulogaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        KorisnikulogaId entity = (KorisnikulogaId) o;
        return Objects.equals(this.korisnikId, entity.korisnikId) &&
                Objects.equals(this.ulogaId, entity.ulogaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(korisnikId, ulogaId);
    }

}