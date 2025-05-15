package hr.unizg.fer.backend.backend.dto;

public class TvrtkaDTO extends KorisnikDTO {
    private String oib;
    private String nazivTvrtke;
    private String adresa;
    
    public String getOib() {
        return oib;
    }
    
    public void setOib(String oib) {
        this.oib = oib;
    }
    
    public String getNazivTvrtke() {
        return nazivTvrtke;
    }
    
    public void setNazivTvrtke(String nazivTvrtke) {
        this.nazivTvrtke = nazivTvrtke;
    }
    
    public String getAdresa() {
        return adresa;
    }
    
    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }
}