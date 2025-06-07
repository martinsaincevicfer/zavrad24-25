package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "ponuditeljvjestina")
public class Ponuditeljvjestina {
    @EmbeddedId
    private PonuditeljvjestinaId id;

    @MapsId("ponuditeljId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "ponuditelj_id", nullable = false)
    private Ponuditelj ponuditelj;

    @MapsId("vjestinaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vjestina_id", nullable = false)
    private Vjestina vjestina;

    public PonuditeljvjestinaId getId() {
        return id;
    }

    public void setId(PonuditeljvjestinaId id) {
        this.id = id;
    }

    public Ponuditelj getPonuditelj() {
        return ponuditelj;
    }

    public void setPonuditelj(Ponuditelj ponuditelj) {
        this.ponuditelj = ponuditelj;
    }

    public Vjestina getVjestina() {
        return vjestina;
    }

    public void setVjestina(Vjestina vjestina) {
        this.vjestina = vjestina;
    }

}