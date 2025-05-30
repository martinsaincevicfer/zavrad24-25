package hr.unizg.fer.backend.backend.dto;

import java.math.BigDecimal;

public class PrijavaFormDTO {
    private BigDecimal iznos;
    private String poruka;
    private Integer projektId;

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

    public Integer getProjektId() {
        return projektId;
    }

    public void setProjektId(Integer projektId) {
        this.projektId = projektId;
    }
}