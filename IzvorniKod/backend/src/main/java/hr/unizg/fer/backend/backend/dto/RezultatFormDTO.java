package hr.unizg.fer.backend.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class RezultatFormDTO {
    private Integer ugovorId;
    private String naziv;
    private MultipartFile file;

    public RezultatFormDTO() {
    }

    public RezultatFormDTO(Integer ugovorId, String naziv, MultipartFile file) {
        this.ugovorId = ugovorId;
        this.naziv = naziv;
        this.file = file;
    }

    public Integer getUgovorId() {
        return ugovorId;
    }

    public void setUgovorId(Integer ugovorId) {
        this.ugovorId = ugovorId;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
