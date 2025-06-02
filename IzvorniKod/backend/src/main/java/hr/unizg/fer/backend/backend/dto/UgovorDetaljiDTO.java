package hr.unizg.fer.backend.backend.dto;

import java.time.LocalDate;

public class UgovorDetaljiDTO {
    private Integer id;
    private String status;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private Integer prijavaId;
    private ProjektDTO projekt;

    public UgovorDetaljiDTO() {
    }

    public UgovorDetaljiDTO(Integer id, String status, LocalDate datumPocetka, LocalDate datumZavrsetka, Integer prijavaId, ProjektDTO projekt) {
        this.id = id;
        this.status = status;
        this.datumPocetka = datumPocetka;
        this.datumZavrsetka = datumZavrsetka;
        this.prijavaId = prijavaId;
        this.projekt = projekt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(LocalDate datumPocetka) {
        this.datumPocetka = datumPocetka;
    }

    public LocalDate getDatumZavrsetka() {
        return datumZavrsetka;
    }

    public void setDatumZavrsetka(LocalDate datumZavrsetka) {
        this.datumZavrsetka = datumZavrsetka;
    }

    public Integer getPrijavaId() {
        return prijavaId;
    }

    public void setPrijavaId(Integer prijavaId) {
        this.prijavaId = prijavaId;
    }

    public ProjektDTO getProjekt() {
        return projekt;
    }

    public void setProjekt(ProjektDTO projekt) {
        this.projekt = projekt;
    }
}