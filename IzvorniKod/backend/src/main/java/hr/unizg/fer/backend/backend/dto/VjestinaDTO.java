package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Vjestina;

public class VjestinaDTO {

    private Integer id;
    private String naziv;
    private String kategorija;

    public VjestinaDTO() {
    }

    public VjestinaDTO(Vjestina vjestina) {
        this.id = vjestina.getId();
        this.naziv = vjestina.getNaziv();
        this.kategorija = vjestina.getKategorija();
    }

    public VjestinaDTO(Integer id) {
        this.id = id;
    }

    public VjestinaDTO(Integer id, String naziv, String kategorija) {
        this.id = id;
        this.naziv = naziv;
        this.kategorija = kategorija;
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

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    @Override
    public String toString() {
        return "VjestinaDTO{" +
                "id=" + id +
                ", naziv='" + naziv + '\'' +
                ", kategorija='" + kategorija + '\'' +
                '}';
    }
}
