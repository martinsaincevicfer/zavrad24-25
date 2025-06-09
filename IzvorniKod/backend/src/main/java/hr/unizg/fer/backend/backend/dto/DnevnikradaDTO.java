package hr.unizg.fer.backend.backend.dto;

import java.time.Instant;

public class DnevnikradaDTO {
    private Integer id;
    private Integer ugovorId;
    private String opis;
    private Instant datumUnosa;

    public DnevnikradaDTO() {
    }

    public DnevnikradaDTO(Integer id, Integer ugovorId, String opis, Instant datumUnosa) {
        this.id = id;
        this.ugovorId = ugovorId;
        this.opis = opis;
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

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public Instant getDatumUnosa() {
        return datumUnosa;
    }

    public void setDatumUnosa(Instant datumUnosa) {
        this.datumUnosa = datumUnosa;
    }
}