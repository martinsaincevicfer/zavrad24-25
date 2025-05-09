package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.domain.Vjestina;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjektDTO {
    private Integer id;
    private String naziv;
    private String opis;
    private BigDecimal budzet;
    private LocalDate rok;
    private Instant datumStvaranja;
    private Integer korisnikId;
    private Set<VjestinaDTO> vjestine;

    public ProjektDTO(Integer id, String naziv, String opis, BigDecimal budzet, LocalDate rok, Instant datumStvaranja, Integer korisnikId, Set<VjestinaDTO> vjestine) {
        this.id = id;
        this.naziv = naziv;
        this.opis = opis;
        this.budzet = budzet;
        this.rok = rok;
        this.datumStvaranja = datumStvaranja;
        this.korisnikId = korisnikId;
        this.vjestine = vjestine;
    }

    public ProjektDTO(Projekt projekt) {
        this.id = projekt.getId();
        this.naziv = projekt.getNaziv();
        this.opis = projekt.getOpis();
        this.budzet = projekt.getBudzet();
        this.rok = projekt.getRok();
        this.datumStvaranja = projekt.getDatumStvaranja();
        this.korisnikId = projekt.getKorisnik().getId();
        this.vjestine = projekt.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet());
    }

    public LocalDate getRok() {
        return rok;
    }

    public void setRok(LocalDate rok) {
        this.rok = rok;
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

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public BigDecimal getBudzet() {
        return budzet;
    }

    public void setBudzet(BigDecimal budzet) {
        this.budzet = budzet;
    }

    public Instant getDatumStvaranja() {
        return datumStvaranja;
    }

    public void setDatumStvaranja(Instant datumStvaranja) {
        this.datumStvaranja = datumStvaranja;
    }

    public Integer getKorisnikId() {
        return korisnikId;
    }

    public void setKorisnikId(Integer korisnikId) {
        this.korisnikId = korisnikId;
    }

    public Set<VjestinaDTO> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<VjestinaDTO> vjestine) {
        this.vjestine = vjestine;
    }
}
