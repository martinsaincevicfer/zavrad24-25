package hr.unizg.fer.backend.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class UgovorRequestDTO {
    @NotNull
    private Integer prijavaId;

    @NotNull
    private LocalDate datumPocetka;

    public Integer getPrijavaId() {
        return prijavaId;
    }

    public void setPrijavaId(Integer prijavaId) {
        this.prijavaId = prijavaId;
    }

    public LocalDate getDatumPocetka() {
        return datumPocetka;
    }

    public void setDatumPocetka(LocalDate datumPocetka) {
        this.datumPocetka = datumPocetka;
    }
}