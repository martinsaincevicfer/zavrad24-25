package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Slobodnjak;

import java.time.Instant;

public class SlobodnjakDTO {
    private Integer id;
    private Integer slobodnjakId;
    private String kratkiOpis;
    private String edukacija;
    private String iskustvo;
    private Instant datumStvaranja;
    private KorisnikDTO korisnik;

    public SlobodnjakDTO(Slobodnjak slobodnjak) {
        this.id = slobodnjak.getId();
        this.slobodnjakId = slobodnjak.getSlobodnjakId();
        this.kratkiOpis = slobodnjak.getKratkiOpis();
        this.edukacija = slobodnjak.getEdukacija();
        this.iskustvo = slobodnjak.getIskustvo();
        this.datumStvaranja = slobodnjak.getDatumStvaranja();
        this.korisnik = new KorisnikDTO(slobodnjak.getKorisnik());
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSlobodnjakId() {
        return slobodnjakId;
    }

    public void setSlobodnjakId(Integer slobodnjakId) {
        this.slobodnjakId = slobodnjakId;
    }

    public String getKratkiOpis() {
        return kratkiOpis;
    }

    public void setKratkiOpis(String kratkiOpis) {
        this.kratkiOpis = kratkiOpis;
    }

    public String getEdukacija() {
        return edukacija;
    }

    public void setEdukacija(String edukacija) {
        this.edukacija = edukacija;
    }

    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
    }

    public KorisnikDTO getKorisnik() {
        return korisnik;
    }

    public void setKorisnik(KorisnikDTO korisnik) {
        this.korisnik = korisnik;
    }
}
