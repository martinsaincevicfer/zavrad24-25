package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PrijavaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.*;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import hr.unizg.fer.backend.backend.dto.UgovorDTO;
import hr.unizg.fer.backend.backend.dto.UgovorDetaljiDTO;
import hr.unizg.fer.backend.backend.dto.VjestinaDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.logging.LoggersEndpoint;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UgovorService {
    @Autowired
    private final UgovorRepository ugovorRepository;

    @Autowired
    private final PrijavaRepository prijavaRepository;
    @Autowired
    private KorisnikRepository korisnikRepository;
    @Autowired
    private LoggersEndpoint loggersEndpoint;

    public UgovorService(UgovorRepository ugovorRepository, PrijavaRepository prijavaRepository) {
        this.ugovorRepository = ugovorRepository;
        this.prijavaRepository = prijavaRepository;
    }

    @Transactional
    public UgovorDetaljiDTO getUgovorById(Integer ugovorId) {
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor ne postoji za ID: " + ugovorId));

        Prijava prijava = ugovor.getPrijava();
        Projekt projekt = prijava.getProjekt();

        ProjektDTO projektDTO = new ProjektDTO(
                projekt.getId(),
                projekt.getNaziv(),
                projekt.getOpis(),
                projekt.getBudzet(),
                projekt.getRok(),
                projekt.getDatumStvaranja(),
                projekt.getKorisnik().getId(),
                projekt.getVjestine().stream()
                        .map(VjestinaDTO::new)
                        .collect(Collectors.toSet())
        );

        return new UgovorDetaljiDTO(
                ugovor.getId(),
                ugovor.getStatus(),
                ugovor.getDatumPocetka(),
                ugovor.getDatumZavrsetka(),
                prijava.getId(),
                projektDTO
        );
    }

    @Transactional
    public List<UgovorDTO> findAllByKorisnikEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik s emailom " + email + " ne postoji."));

        return ugovorRepository.findByPrijava_Projekt_Korisnik_Id(korisnik.getId()).stream()
                .map(ugovor -> {
                    Prijava prijava = ugovor.getPrijava();
                    Projekt projekt = prijava.getProjekt();

                    String nazivProjekta = (projekt != null) ? projekt.getNaziv() : "Nepoznat projekt";
                    String nazivKorisnika = (projekt != null && projekt.getKorisnik() != null)
                            ? getNazivKorisnik(projekt.getKorisnik())
                            : "Nepoznat korisnik";

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            prijava.getId(),
                            nazivProjekta,
                            nazivKorisnika
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UgovorDTO> findAllByHonoraracEmail(String email) {
        Korisnik honorarac = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Honorarac s emailom " + email + " ne postoji."));

        return ugovorRepository.findByPrijava_Korisnik_Id(honorarac.getId()).stream()
                .map(ugovor -> {
                    Prijava prijava = ugovor.getPrijava();
                    Projekt projekt = prijava.getProjekt();

                    String nazivProjekta = (projekt != null) ? projekt.getNaziv() : "Nepoznat projekt";
                    String nazivKorisnika = (projekt != null && projekt.getKorisnik() != null)
                            ? getNazivKorisnik(projekt.getKorisnik())
                            : "Nepoznat korisnik";

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            prijava.getId(),
                            nazivProjekta,
                            nazivKorisnika
                    );
                })
                .collect(Collectors.toList());
    }

    private String getNazivKorisnik(Korisnik korisnik) {
        if (korisnik.getOsoba() != null) {
            Osoba osoba = korisnik.getOsoba();
            return osoba.getIme() + " " + osoba.getPrezime();
        } else if (korisnik.getTvrtka() != null) {
            return korisnik.getTvrtka().getNazivTvrtke();
        } else {
            return "Nepoznato";
        }
    }

    @Transactional
    public UgovorDTO createUgovorForKorisnik(Integer prijavaId, LocalDate datumPocetka) {
        Prijava prijava = prijavaRepository.findById(prijavaId)
                .orElseThrow(() -> new IllegalArgumentException("Prijava ne postoji za ID: " + prijavaId));

        Ugovor ugovor = new Ugovor();
        ugovor.setPrijava(prijava);
        ugovor.setDatumPocetka(datumPocetka);
        ugovor.setDatumZavrsetka(null);
        ugovor.setStatus("aktivan");

        Ugovor savedUgovor = ugovorRepository.save(ugovor);

        return new UgovorDTO(
                savedUgovor.getId(),
                savedUgovor.getStatus(),
                savedUgovor.getDatumPocetka(),
                savedUgovor.getDatumZavrsetka(),
                savedUgovor.getPrijava().getId()
        );
    }

    @Transactional
    public UgovorDTO markUgovorAsFinished(Integer ugovorId) {
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor ne postoji za ID: " + ugovorId));

        ugovor.setDatumZavrsetka(LocalDate.now());
        ugovor.setStatus("zavrsen");

        Ugovor savedUgovor = ugovorRepository.save(ugovor);

        return new UgovorDTO(
                savedUgovor.getId(),
                savedUgovor.getStatus(),
                savedUgovor.getDatumPocetka(),
                savedUgovor.getDatumZavrsetka(),
                savedUgovor.getPrijava().getId()
        );
    }
}
