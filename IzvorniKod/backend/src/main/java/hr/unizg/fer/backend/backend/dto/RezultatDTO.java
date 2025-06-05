package hr.unizg.fer.backend.backend.dto;

public class RezultatDTO {
    private Integer id;
    private String naziv;
    private String datotekaUrl;

    public RezultatDTO() {
    }

    public RezultatDTO(Integer id, String naziv, String datotekaUrl) {
        this.id = id;
        this.naziv = naziv;
        this.datotekaUrl = datotekaUrl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getDatotekaUrl() {
        return datotekaUrl;
    }

    public void setDatotekaUrl(String datotekaUrl) {
        this.datotekaUrl = datotekaUrl;
    }
}
