package hr.unizg.fer.backend.backend.dto;

import java.time.Instant;

public class RecenzijaDTO {
    private Integer ocjena;
    private String komentar;
    private Instant datumStvaranja;
    private String naruciteljIme;

    public RecenzijaDTO() {
    }

    public RecenzijaDTO(Integer ocjena, String komentar, Instant datumStvaranja, String naruciteljIme) {
        this.ocjena = ocjena;
        this.komentar = komentar;
        this.datumStvaranja = datumStvaranja;
        this.naruciteljIme = naruciteljIme;
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

    public String getNaruciteljIme() {
        return naruciteljIme;
    }

    public void setNaruciteljIme(String naruciteljIme) {
        this.naruciteljIme = naruciteljIme;
    }
}