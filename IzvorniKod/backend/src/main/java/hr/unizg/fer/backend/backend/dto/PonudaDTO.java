package hr.unizg.fer.backend.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class PonudaDTO {
    private Integer id;
    private Integer klijentId;
    private Integer honoraracId;
    private String naziv;
    private String opis;
    private BigDecimal budzet;
    private LocalDate rok;
    private String status;
    private Instant datumStvaranja;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getKlijentId() {
        return klijentId;
    }

    public void setKlijentId(Integer klijentId) {
        this.klijentId = klijentId;
    }

    public Integer getHonoraracId() {
        return honoraracId;
    }

    public void setHonoraracId(Integer honoraracId) {
        this.honoraracId = honoraracId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public BigDecimal getBudzet() {
        return budzet;
    }

    public void setBudzet(BigDecimal budzet) {
        this.budzet = budzet;
    }

    public LocalDate getRok() {
        return rok;
    }

    public void setRok(LocalDate rok) {
        this.rok = rok;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }
}