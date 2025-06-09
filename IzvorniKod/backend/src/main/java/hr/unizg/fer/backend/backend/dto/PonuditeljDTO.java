package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Ponuditelj;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

public class PonuditeljDTO {
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

    public PonuditeljDTO() {
    }

    public PonuditeljDTO(Integer id, String email) {
    }

    public static PonuditeljDTO fromPonuditeljOsoba(Ponuditelj ponuditelj) {
        PonuditeljDTO dto = new PonuditeljDTO();
        dto.setId(ponuditelj.getId());
        dto.setTip("osoba");
        dto.setEmail(ponuditelj.getKorisnik().getEmail());
        dto.setKratkiOpis(ponuditelj.getKratkiOpis());
        dto.setEdukacija(ponuditelj.getEdukacija());
        dto.setIskustvo(ponuditelj.getIskustvo());
        dto.setDatumStvaranja(ponuditelj.getDatumStvaranja());
        dto.setVjestine(ponuditelj.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet()));

        dto.setIme(ponuditelj.getKorisnik().getOsoba().getIme());
        dto.setPrezime(ponuditelj.getKorisnik().getOsoba().getPrezime());
        dto.setAdresa(ponuditelj.getKorisnik().getOsoba().getAdresa());

        return dto;
    }

    public static PonuditeljDTO fromPonuditeljTvrtka(Ponuditelj ponuditelj) {
        PonuditeljDTO dto = new PonuditeljDTO();
        dto.setId(ponuditelj.getId());
        dto.setTip("tvrtka");
        dto.setEmail(ponuditelj.getKorisnik().getEmail());
        dto.setKratkiOpis(ponuditelj.getKratkiOpis());
        dto.setEdukacija(ponuditelj.getEdukacija());
        dto.setIskustvo(ponuditelj.getIskustvo());
        dto.setDatumStvaranja(ponuditelj.getDatumStvaranja());
        dto.setVjestine(ponuditelj.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet()));

        dto.setNazivTvrtke(ponuditelj.getKorisnik().getTvrtka().getNazivTvrtke());
        dto.setOib(ponuditelj.getKorisnik().getTvrtka().getOib());
        dto.setAdresaTvrtke(ponuditelj.getKorisnik().getTvrtka().getAdresa());

        return dto;
    }

    public static PonuditeljDTO basicInfo(Ponuditelj ponuditelj) {
        PonuditeljDTO dto = new PonuditeljDTO();
        dto.setId(ponuditelj.getId());
        dto.setKratkiOpis(ponuditelj.getKratkiOpis());
        dto.setEdukacija(ponuditelj.getEdukacija());
        dto.setIskustvo(ponuditelj.getIskustvo());
        dto.setDatumStvaranja(ponuditelj.getDatumStvaranja());
        dto.setVjestine(ponuditelj.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet()));
        return dto;
    }

    public Set<VjestinaDTO> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<VjestinaDTO> vjestine) {
        this.vjestine = vjestine;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
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

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getNazivTvrtke() {
        return nazivTvrtke;
    }

    public void setNazivTvrtke(String nazivTvrtke) {
        this.nazivTvrtke = nazivTvrtke;
    }

    public String getOib() {
        return oib;
    }

    public void setOib(String oib) {
        this.oib = oib;
    }

    public String getAdresaTvrtke() {
        return adresaTvrtke;
    }

    public void setAdresaTvrtke(String adresaTvrtke) {
        this.adresaTvrtke = adresaTvrtke;
    }

    @Override
    public String toString() {
        return "PonuditeljDTO{" +
                "id=" + id +
                ", tip='" + tip + '\'' +
                ", email='" + email + '\'' +
                ", kratkiOpis='" + kratkiOpis + '\'' +
                ", edukacija='" + edukacija + '\'' +
                ", iskustvo='" + iskustvo + '\'' +
                ", datumStvaranja=" + datumStvaranja +
                ", vjestine=" + vjestine +
                ", ime='" + ime + '\'' +
                ", prezime='" + prezime + '\'' +
                ", adresa='" + adresa + '\'' +
                ", nazivTvrtke='" + nazivTvrtke + '\'' +
                ", oib='" + oib + '\'' +
                ", adresaTvrtke='" + adresaTvrtke + '\'' +
                '}';
    }
}