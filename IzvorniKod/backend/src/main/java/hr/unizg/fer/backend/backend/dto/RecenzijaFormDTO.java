package hr.unizg.fer.backend.backend.dto;

public class RecenzijaFormDTO {
    private Integer ugovorId;
    private Integer ocjena;
    private String komentar;

    public RecenzijaFormDTO() {
    }

    public RecenzijaFormDTO(Integer ugovorId, Integer ocjena, String komentar) {
        this.ugovorId = ugovorId;
        this.ocjena = ocjena;
        this.komentar = komentar;
    }

    public Integer getUgovorId() {
        return ugovorId;
    }

    public void setUgovorId(Integer ugovorId) {
        this.ugovorId = ugovorId;
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
}
