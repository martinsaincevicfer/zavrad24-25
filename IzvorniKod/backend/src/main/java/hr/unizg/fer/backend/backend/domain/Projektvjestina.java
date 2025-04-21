package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "projektvjestina")
public class Projektvjestina {
    @EmbeddedId
    private ProjektvjestinaId id;

    @MapsId("vjestinaId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vjestina_id", nullable = false)
    private Vjestina vjestina;

    @MapsId("projektId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "projekt_id", nullable = false)
    private Projekt projekt;

    public ProjektvjestinaId getId() {
        return id;
    }

    public void setId(ProjektvjestinaId id) {
        this.id = id;
    }

    public Vjestina getVjestina() {
        return vjestina;
    }

    public void setVjestina(Vjestina vjestina) {
        this.vjestina = vjestina;
    }

    public Projekt getProjekt() {
        return projekt;
    }

    public void setProjekt(Projekt projekt) {
        this.projekt = projekt;
    }

}