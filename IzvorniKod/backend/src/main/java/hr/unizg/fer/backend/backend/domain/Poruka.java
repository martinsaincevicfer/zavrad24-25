package hr.unizg.fer.backend.backend.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "poruka")
public class Poruka {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poruka_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "posiljatelj_id", nullable = false)
    private Korisnik posiljatelj;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "primatelj_id", nullable = false)
    private Korisnik primatelj;

    @Column(name = "sadrzaj", nullable = false, length = Integer.MAX_VALUE)
    private String sadrzaj;

    @ColumnDefault("false")
    @Column(name = "procitana", nullable = false)
    private Boolean procitana = false;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "datum_slanja", nullable = false)
    private Instant datumSlanja;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Korisnik getPosiljatelj() {
        return posiljatelj;
    }

    public void setPosiljatelj(Korisnik posiljatelj) {
        this.posiljatelj = posiljatelj;
    }

    public Korisnik getPrimatelj() {
        return primatelj;
    }

    public void setPrimatelj(Korisnik primatelj) {
        this.primatelj = primatelj;
    }

    public String getSadrzaj() {
        return sadrzaj;
    }

    public void setSadrzaj(String sadrzaj) {
        this.sadrzaj = sadrzaj;
    }

    public Boolean getProcitana() {
        return procitana;
    }

    public void setProcitana(Boolean procitana) {
        this.procitana = procitana;
    }

    public Instant getDatumSlanja() {
        return datumSlanja;
    }

    public void setDatumSlanja(Instant datumSlanja) {
        this.datumSlanja = datumSlanja;
    }

}