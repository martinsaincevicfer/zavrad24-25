package hr.unizg.fer.backend.backend.dto;

import java.time.LocalDate;

public class UgovorDTO {
    private Integer id;
    private String status;
    private LocalDate datumPocetka;
    private LocalDate datumZavrsetka;
    private Integer ponudaId;
    private String nazivProjekta;
    private String nazivKorisnika;

    public UgovorDTO() {
    }

    public UgovorDTO(Integer id, String status, LocalDate datumPocetka, LocalDate datumZavrsetka,
                     Integer ponudaId, String nazivProjekta, String korisnikImePrezimeTvrtka) {
        this.id = id;
        this.status = status;
        this.datumPocetka = datumPocetka;
        this.datumZavrsetka = datumZavrsetka;
        this.ponudaId = ponudaId;
        this.nazivProjekta = nazivProjekta;
        this.nazivKorisnika = korisnikImePrezimeTvrtka;
    }

    public UgovorDTO(Integer id, String status, LocalDate datumPocetka, LocalDate datumZavrsetka, Integer ponudaId) {
        this.id = id;
        this.status = status;
        this.datumPocetka = datumPocetka;
        this.datumZavrsetka = datumZavrsetka;
        this.ponudaId = ponudaId;
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

    public String getNazivProjekta() {
        return nazivProjekta;
    }

    public void setNazivProjekta(String nazivProjekta) {
        this.nazivProjekta = nazivProjekta;
    }

    public String getNazivKorisnika() {
        return nazivKorisnika;
    }

    public void setNazivKorisnika(String nazivKorisnika) {
        this.nazivKorisnika = nazivKorisnika;
    }
}