package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PrijavaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Prijava;
import hr.unizg.fer.backend.backend.domain.Ugovor;
import hr.unizg.fer.backend.backend.dto.UgovorDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
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

    public UgovorService(UgovorRepository ugovorRepository, PrijavaRepository prijavaRepository) {
        this.ugovorRepository = ugovorRepository;
        this.prijavaRepository = prijavaRepository;
    }

    @Transactional
    public List<UgovorDTO> findAllByKorisnikEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik s emailom " + email + " ne postoji."));

        System.out.println("Korisnik: " + korisnik.getEmail());

        return ugovorRepository.findByPrijava_Projekt_Korisnik_Id(korisnik.getId()).stream()
                .map(ugovor -> new UgovorDTO(
                        ugovor.getId(),
                        ugovor.getStatus(),
                        ugovor.getDatumPocetka(),
                        ugovor.getDatumZavrsetka(),
                        ugovor.getPrijava().getId()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UgovorDTO> findAllByHonoraracEmail(String email) {
        Korisnik honorarac = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Honorarac s emailom " + email + " ne postoji."));

        return ugovorRepository.findByPrijava_Korisnik_Id(honorarac.getId()).stream()
                .map(ugovor -> new UgovorDTO(
                        ugovor.getId(),
                        ugovor.getStatus(),
                        ugovor.getDatumPocetka(),
                        ugovor.getDatumZavrsetka(),
                        ugovor.getPrijava().getId()
                ))
                .collect(Collectors.toList());
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
