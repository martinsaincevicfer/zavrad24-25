package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PonudaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.*;
import hr.unizg.fer.backend.backend.dto.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UgovorService {
    private final UgovorRepository ugovorRepository;
    private final PonudaRepository ponudaRepository;
    private final KorisnikRepository korisnikRepository;

    public UgovorService(UgovorRepository ugovorRepository, PonudaRepository ponudaRepository, KorisnikRepository korisnikRepository) {
        this.ugovorRepository = ugovorRepository;
        this.ponudaRepository = ponudaRepository;
        this.korisnikRepository = korisnikRepository;
    }

    @Transactional
    public UgovorDetaljiDTO getUgovorById(Integer ugovorId) {
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor ne postoji za ID: " + ugovorId));

        Ponuda ponuda = ugovor.getPonuda();
        Recenzija recenzija = ugovor.getRecenzija();
        Projekt projekt = ponuda.getProjekt();

        ProjektDTO projektDTO = new ProjektDTO(
                projekt.getId(),
                projekt.getNaziv(),
                projekt.getOpis(),
                projekt.getBudzet(),
                projekt.getRokIzrade(),
                projekt.getDatumStvaranja(),
                projekt.getNarucitelj().getId(),
                projekt.getVjestine().stream()
                        .map(VjestinaDTO::new)
                        .collect(Collectors.toSet())
        );

        RecenzijaDTO recenzijaDTO = null;
        if (recenzija != null) {
            recenzijaDTO = new RecenzijaDTO(
                    recenzija.getOcjena(),
                    recenzija.getKomentar(),
                    recenzija.getDatumStvaranja()
            );
        }

        return new UgovorDetaljiDTO(
                ugovor.getId(),
                ugovor.getStatus(),
                ugovor.getDatumPocetka(),
                ugovor.getDatumZavrsetka(),
                ponuda.getId(),
                projektDTO,
                recenzijaDTO
        );
    }

    @Transactional
    public List<UgovorDTO> findAllByKorisnikEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik s emailom " + email + " ne postoji."));

        return ugovorRepository.findByPonuda_Projekt_Narucitelj_Id(korisnik.getId()).stream()
                .map(ugovor -> {
                    Ponuda ponuda = ugovor.getPonuda();
                    Projekt projekt = ponuda.getProjekt();

                    String nazivProjekta = (projekt != null) ? projekt.getNaziv() : "Nepoznat projekt";
                    String nazivKorisnika = (projekt != null && projekt.getNarucitelj() != null)
                            ? getNazivKorisnik(projekt.getNarucitelj())
                            : "Nepoznat korisnik";

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            ponuda.getId(),
                            nazivProjekta,
                            nazivKorisnika
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UgovorDTO> findAllByPonuditeljEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik s emailom " + email + " ne postoji."));

        return ugovorRepository.findByPonuda_Ponuditelj_Id(korisnik.getId()).stream()
                .map(ugovor -> {
                    Ponuda ponuda = ugovor.getPonuda();
                    Projekt projekt = ponuda.getProjekt();

                    String nazivProjekta = (projekt != null) ? projekt.getNaziv() : "Nepoznat projekt";
                    String nazivKorisnika = (projekt != null && projekt.getNarucitelj() != null)
                            ? getNazivKorisnik(projekt.getNarucitelj())
                            : "Nepoznat korisnik";

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            ponuda.getId(),
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
    public UgovorDTO createUgovorForKorisnik(Integer ponudaId, LocalDate datumPocetka) {
        Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(() -> new IllegalArgumentException("Ponuda ne postoji za ID: " + ponudaId));

        ponuda.setStatus("prihvacena");
        ponudaRepository.save(ponuda);

        Ugovor ugovor = new Ugovor();
        ugovor.setPonuda(ponuda);
        ugovor.setDatumPocetka(datumPocetka);
        ugovor.setDatumZavrsetka(null);
        ugovor.setStatus("aktivan");

        Ugovor savedUgovor = ugovorRepository.save(ugovor);

        return new UgovorDTO(
                savedUgovor.getId(),
                savedUgovor.getStatus(),
                savedUgovor.getDatumPocetka(),
                savedUgovor.getDatumZavrsetka(),
                savedUgovor.getPonuda().getId()
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
                savedUgovor.getPonuda().getId()
        );
    }
}
