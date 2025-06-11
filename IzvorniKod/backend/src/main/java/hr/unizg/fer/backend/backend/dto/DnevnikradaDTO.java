package hr.unizg.fer.backend.backend.dto;

import java.time.Instant;

public class DnevnikradaDTO {
    private Integer id;
    private Integer ugovorId;
    private String poruka;
    private Instant datumUnosa;

    public DnevnikradaDTO() {
    }

    public DnevnikradaDTO(Integer id, Integer ugovorId, String poruka, Instant datumUnosa) {
        this.id = id;
        this.ugovorId = ugovorId;
        this.poruka = poruka;
        this.datumUnosa = datumUnosa;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUgovorId() {
        return ugovorId;
    }

    public void setUgovorId(Integer ugovorId) {
        this.ugovorId = ugovorId;
    }

    public String getPoruka() {
        return poruka;
    }

    public void setPoruka(String poruka) {
        this.poruka = poruka;
    }

    public Instant getDatumUnosa() {
        return datumUnosa;
    }

    public void setDatumUnosa(Instant datumUnosa) {
        this.datumUnosa = datumUnosa;
    }
}