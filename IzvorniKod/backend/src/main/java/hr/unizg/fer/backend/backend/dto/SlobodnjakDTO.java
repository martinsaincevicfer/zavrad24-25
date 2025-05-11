package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Slobodnjak;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

public class SlobodnjakDTO {
    private Integer id;
    private String tip;
    private String email;
    private String kratkiOpis;
    private String edukacija;
    private String iskustvo;
    private Instant datumStvaranja;
    private Set<VjestinaDTO> vjestine;
    
    private String ime;
    private String prezime;
    private String adresa;
    
    private String nazivTvrtke;
    private String oib;
    private String adresaTvrtke;

    public static SlobodnjakDTO fromSlobodnjakOsoba(Slobodnjak slobodnjak) {
        SlobodnjakDTO dto = new SlobodnjakDTO();
        dto.setId(slobodnjak.getId());
        dto.setTip("OSOBA");
        dto.setEmail(slobodnjak.getKorisnik().getEmail());
        dto.setKratkiOpis(slobodnjak.getKratkiOpis());
        dto.setEdukacija(slobodnjak.getEdukacija());
        dto.setIskustvo(slobodnjak.getIskustvo());
        dto.setDatumStvaranja(slobodnjak.getDatumStvaranja());
        dto.setVjestine(slobodnjak.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet()));
        
        dto.setIme(slobodnjak.getKorisnik().getOsoba().getIme());
        dto.setPrezime(slobodnjak.getKorisnik().getOsoba().getPrezime());
        dto.setAdresa(slobodnjak.getKorisnik().getOsoba().getAdresa());
        
        return dto;
    }

    public static SlobodnjakDTO fromSlobodnjakTvrtka(Slobodnjak slobodnjak) {
        SlobodnjakDTO dto = new SlobodnjakDTO();
        dto.setId(slobodnjak.getId());
        dto.setTip("TVRTKA");
        dto.setEmail(slobodnjak.getKorisnik().getEmail());
        dto.setKratkiOpis(slobodnjak.getKratkiOpis());
        dto.setEdukacija(slobodnjak.getEdukacija());
        dto.setIskustvo(slobodnjak.getIskustvo());
        dto.setDatumStvaranja(slobodnjak.getDatumStvaranja());
        dto.setVjestine(slobodnjak.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet()));
        
        dto.setNazivTvrtke(slobodnjak.getKorisnik().getTvrtka().getNazivTvrtke());
        dto.setOib(slobodnjak.getKorisnik().getTvrtka().getOib());
        dto.setAdresaTvrtke(slobodnjak.getKorisnik().getTvrtka().getAdresa());
        
        return dto;
    }

    public Set<VjestinaDTO> getVjestine() { return vjestine; }
    public void setVjestine(Set<VjestinaDTO> vjestine) { this.vjestine = vjestine; }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getTip() { return tip; }
    public void setTip(String tip) { this.tip = tip; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getKratkiOpis() { return kratkiOpis; }
    public void setKratkiOpis(String kratkiOpis) { this.kratkiOpis = kratkiOpis; }
    
    public String getEdukacija() { return edukacija; }
    public void setEdukacija(String edukacija) { this.edukacija = edukacija; }
    
    public String getIskustvo() { return iskustvo; }
    public void setIskustvo(String iskustvo) { this.iskustvo = iskustvo; }
    
    public Instant getDatumStvaranja() { return datumStvaranja; }
    public void setDatumStvaranja(Instant datumStvaranja) { this.datumStvaranja = datumStvaranja; }
    
    public String getIme() { return ime; }
    public void setIme(String ime) { this.ime = ime; }
    
    public String getPrezime() { return prezime; }
    public void setPrezime(String prezime) { this.prezime = prezime; }
    
    public String getAdresa() { return adresa; }
    public void setAdresa(String adresa) { this.adresa = adresa; }
    
    public String getNazivTvrtke() { return nazivTvrtke; }
    public void setNazivTvrtke(String nazivTvrtke) { this.nazivTvrtke = nazivTvrtke; }
    
    public String getOib() { return oib; }
    public void setOib(String oib) { this.oib = oib; }
    
    public String getAdresaTvrtke() { return adresaTvrtke; }
    public void setAdresaTvrtke(String adresaTvrtke) { this.adresaTvrtke = adresaTvrtke; }
}