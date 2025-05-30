package hr.unizg.fer.backend.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class PrijavaDTO {
    private Integer id;
    private String status;
    private BigDecimal iznos;
    private String poruka;
    private Instant datumStvaranja;
    private ProjektDTO projekt;
    private HonoraracDTO honorarac;

    public PrijavaDTO() {
    }

    public PrijavaDTO(Integer id, String status, BigDecimal iznos, String poruka, Instant datumStvaranja, ProjektDTO projekt, HonoraracDTO honorarac) {
        this.id = id;
        this.status = status;
        this.iznos = iznos;
        this.poruka = poruka;
        this.datumStvaranja = datumStvaranja;
        this.projekt = projekt;
        this.honorarac = honorarac;
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

    public HonoraracDTO getHonorarac() {
        return honorarac;
    }

    public void setHonorarac(HonoraracDTO honorarac) {
        this.honorarac = honorarac;
    }
}