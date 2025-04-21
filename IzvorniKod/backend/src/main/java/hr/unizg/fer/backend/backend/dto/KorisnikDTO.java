package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Korisnik;

public class KorisnikDTO {
    private Integer id;
    private String ime;
    private String prezime;
    private String email;
    private String naziv;

    public KorisnikDTO(Korisnik korisnik) {
        this.id = korisnik.getId();
        this.ime = korisnik.getIme();
        this.prezime = korisnik.getPrezime();
        this.email = korisnik.getEmail();
        this.naziv = korisnik.getNaziv();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }
}
