package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Osoba;
import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.domain.Tvrtka;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjektDTO {
    private Integer id;

    @NotBlank(message = "Naziv ne smije biti prazan")
    private String naziv;

    private String opis;

    @NotNull(message = "Budžet mora biti specificiran")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budžet mora biti veći od 0")
    private BigDecimal budzet;

    @NotNull(message = "Rok mora biti definiran")
    private LocalDate rokIzrade;

    private Instant datumStvaranja;

    private KorisnikDTO narucitelj;

    private Set<@Valid VjestinaDTO> vjestine;

    public ProjektDTO() {
    }

    public ProjektDTO(Integer id, String naziv) {
        this.id = id;
        this.naziv = naziv;
    }

    public ProjektDTO(Integer id, String naziv, String opis, BigDecimal budzet, LocalDate rokIzrade, Instant datumStvaranja, KorisnikDTO narucitelj, Set<VjestinaDTO> vjestine) {
        this.id = id;
        this.naziv = naziv;
        this.opis = opis;
        this.budzet = budzet;
        this.rokIzrade = rokIzrade;
        this.datumStvaranja = datumStvaranja;
        this.narucitelj = narucitelj;
        this.vjestine = vjestine;
    }

    public ProjektDTO(Projekt projekt) {
        this.id = projekt.getId();
        this.naziv = projekt.getNaziv();
        this.opis = projekt.getOpis();
        this.budzet = projekt.getBudzet();
        this.rokIzrade = projekt.getRokIzrade();
        this.datumStvaranja = projekt.getDatumStvaranja();
        Korisnik naruciteljEntity = projekt.getNarucitelj();
        if (naruciteljEntity.getOsoba() != null) {
            Osoba osoba = naruciteljEntity.getOsoba();
            this.narucitelj = new OsobaDTO();
            this.narucitelj.setId(osoba.getId());
            this.narucitelj.setEmail(naruciteljEntity.getEmail());
            this.narucitelj.setTip("osoba");

            ((OsobaDTO) this.narucitelj).setIme(osoba.getIme());
            ((OsobaDTO) this.narucitelj).setPrezime(osoba.getPrezime());
            ((OsobaDTO) this.narucitelj).setAdresa(osoba.getAdresa());
        } else if (naruciteljEntity.getTvrtka() != null) {
            Tvrtka tvrtka = naruciteljEntity.getTvrtka();
            this.narucitelj = new TvrtkaDTO();
            this.narucitelj.setId(tvrtka.getId());
            this.narucitelj.setEmail(naruciteljEntity.getEmail());
            this.narucitelj.setTip("tvrtka");

            ((TvrtkaDTO) this.narucitelj).setOib(tvrtka.getOib());
            ((TvrtkaDTO) this.narucitelj).setNazivTvrtke(tvrtka.getNazivTvrtke());
            ((TvrtkaDTO) this.narucitelj).setAdresa(tvrtka.getAdresa());
        } else {
            this.narucitelj = null;
        }
        this.vjestine = projekt.getVjestine().stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toSet());
    }

    public LocalDate getRokIzrade() {
        return rokIzrade;
    }

    public void setRokIzrade(LocalDate rokIzrade) {
        this.rokIzrade = rokIzrade;
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

    public KorisnikDTO getNarucitelj() {
        return narucitelj;
    }

    public void setNarucitelj(KorisnikDTO narucitelj) {
        this.narucitelj = narucitelj;
    }

    public Set<VjestinaDTO> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<VjestinaDTO> vjestine) {
        this.vjestine = vjestine;
    }
}
