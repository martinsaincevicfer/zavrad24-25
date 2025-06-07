package hr.unizg.fer.backend.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PonudaDTO {
    private Integer id;
    private String status;
    private BigDecimal iznos;
    private String poruka;
    private Instant rokZaPrihvacanje;
    private Instant datumStvaranja;
    private ProjektDTO projekt;
    private PonuditeljDTO ponuditelj;

    public PonudaDTO() {
    }

    public PonudaDTO(Integer id, String status, BigDecimal iznos, String poruka, Instant rokZaPrihvacanje, Instant datumStvaranja, ProjektDTO projekt, PonuditeljDTO ponuditelj) {
        this.id = id;
        this.status = status;
        this.iznos = iznos;
        this.poruka = poruka;
        this.rokZaPrihvacanje = rokZaPrihvacanje;
        this.datumStvaranja = datumStvaranja;
        this.projekt = projekt;
        this.ponuditelj = ponuditelj;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getIznos() {
        return iznos;
    }

    public void setIznos(BigDecimal iznos) {
        this.iznos = iznos;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public Instant getRokZaPrihvacanje() {
        return rokZaPrihvacanje;
    }

    public void setRokZaPrihvacanje(Instant rokZaPrihvacanje) {
        this.rokZaPrihvacanje = rokZaPrihvacanje;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public ProjektDTO getProjekt() {
        return projekt;
    }

    public void setProjekt(ProjektDTO projekt) {
        this.projekt = projekt;
    }

    public PonuditeljDTO getPonuditelj() {
        return ponuditelj;
    }

    public void setPonuditelj(PonuditeljDTO ponuditelj) {
        this.ponuditelj = ponuditelj;
    }
}