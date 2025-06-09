package hr.unizg.fer.backend.backend.dto;

import hr.unizg.fer.backend.backend.domain.Projekt;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public class ProjektFormDTO {
    private Integer id;

    @NotBlank(message = "Naziv ne smije biti prazan")
    private String naziv;

    private String opis;

    @NotNull(message = "Budžet mora biti specificiran")
    @DecimalMin(value = "0.0", inclusive = false, message = "Budžet mora biti veći od 0")
    private BigDecimal budzet;

    @NotNull(message = "Rok mora biti definiran")
    private LocalDate rok;

    private Instant datumStvaranja;

    private Integer naruciteljId;

    private Set<@Valid VjestinaDTO> vjestine;

    public ProjektFormDTO() {
    }

    public ProjektFormDTO(Integer id, String naziv) {
        this.id = id;
        this.naziv = naziv;
    }

    public ProjektFormDTO(Integer id, String naziv, String opis, BigDecimal budzet, LocalDate rok, Instant datumStvaranja, Integer naruciteljId, Set<VjestinaDTO> vjestine) {
        this.id = id;
        this.naziv = naziv;
        this.opis = opis;
        this.budzet = budzet;
        this.rok = rok;
        this.datumStvaranja = datumStvaranja;
        this.naruciteljId = naruciteljId;
        this.vjestine = vjestine;
    }

    public ProjektFormDTO(Projekt projekt) {
        this.id = projekt.getId();
        this.naziv = projekt.getNaziv();
        this.opis = projekt.getOpis();
        this.budzet = projekt.getBudzet();
        this.rok = projekt.getRokIzrade();
        this.datumStvaranja = projekt.getDatumStvaranja();
        this.naruciteljId = projekt.getNarucitelj().getId();
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

    public Integer getNaruciteljId() {
        return naruciteljId;
    }

    public void setNaruciteljId(Integer naruciteljId) {
        this.naruciteljId = naruciteljId;
    }

    public Set<VjestinaDTO> getVjestine() {
        return vjestine;
    }

    public void setVjestine(Set<VjestinaDTO> vjestine) {
        this.vjestine = vjestine;
    }
}
