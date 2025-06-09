package hr.unizg.fer.backend.backend.dto;

import java.time.LocalDate;

public class UgovorDTO {
    private Integer id;
    private String status;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private PonudaDTO ponuda;
    private ProjektDTO projekt;
    private RecenzijaDTO recenzija;

    public UgovorDTO() {
    }

    public UgovorDTO(Integer id, String status, LocalDate datumPocetka, LocalDate datumZavrsetka, PonudaDTO ponuda, ProjektDTO projekt, RecenzijaDTO recenzija) {
        this.id = id;
        this.status = status;
        this.datumPocetka = datumPocetka;
        this.datumZavrsetka = datumZavrsetka;
        this.ponuda = ponuda;
        this.projekt = projekt;
        this.recenzija = recenzija;
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

    public PonudaDTO getPonuda() {
        return ponuda;
    }

    public void setPonuda(PonudaDTO ponuda) {
        this.ponuda = ponuda;
    }

    public ProjektDTO getProjekt() {
        return projekt;
    }

    public void setProjekt(ProjektDTO projekt) {
        this.projekt = projekt;
    }

    public RecenzijaDTO getRecenzija() {
        return recenzija;
    }

    public void setRecenzija(RecenzijaDTO recenzija) {
        this.recenzija = recenzija;
    }
}