package hr.unizg.fer.backend.backend.dto;

import java.time.Instant;

public class RecenzijaDTO {
    private Integer ocjena;
    private String komentar;
    private Instant datumStvaranja;

    public RecenzijaDTO() {
    }

    public RecenzijaDTO(Integer ocjena, String komentar, Instant datumStvaranja) {
        this.ocjena = ocjena;
        this.komentar = komentar;
        this.datumStvaranja = datumStvaranja;
    }

    public Integer getOcjena() {
        return ocjena;
    }

    public void setOcjena(Integer ocjena) {
        this.ocjena = ocjena;
    }

    public String getKomentar() {
        return komentar;
    }

    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }
}
