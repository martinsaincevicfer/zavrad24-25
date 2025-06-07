package hr.unizg.fer.backend.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class UgovorRequestDTO {
    @NotNull
    private Integer ponudaId;

    @NotNull
    private LocalDate datumPocetka;

    public Integer getPonudaId() {
        return ponudaId;
    }

    public void setPonudaId(Integer ponudaId) {
        this.ponudaId = ponudaId;
    }

    public LocalDate getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(LocalDate datumPocetka) {
        this.datumPocetka = datumPocetka;
    }
}