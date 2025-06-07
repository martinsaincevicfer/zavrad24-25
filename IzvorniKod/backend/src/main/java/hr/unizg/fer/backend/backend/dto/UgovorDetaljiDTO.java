package hr.unizg.fer.backend.backend.dto;

import java.time.LocalDate;

public class UgovorDetaljiDTO {
    private Integer id;
    private String status;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private Integer ponudaId;
    private ProjektDTO projekt;
    private RecenzijaDTO recenzija;

    public UgovorDetaljiDTO() {
    }

    public UgovorDetaljiDTO(Integer id, String status, LocalDate datumPocetka, LocalDate datumZavrsetka, Integer ponudaId, ProjektDTO projekt, RecenzijaDTO recenzija) {
        this.id = id;
        this.status = status;
        this.datumPocetka = datumPocetka;
        this.datumZavrsetka = datumZavrsetka;
        this.ponudaId = ponudaId;
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

    public Integer getPonudaId() {
        return ponudaId;
    }

    public void setPonudaId(Integer ponudaId) {
        this.ponudaId = ponudaId;
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