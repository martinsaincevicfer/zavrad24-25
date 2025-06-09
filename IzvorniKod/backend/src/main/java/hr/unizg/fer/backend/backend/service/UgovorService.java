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
    public UgovorDTO getUgovorById(Integer ugovorId) {
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor ne postoji za ID: " + ugovorId));

        Ponuda ponuda = ugovor.getPonuda();
        Recenzija recenzija = ugovor.getRecenzija();
        Projekt projekt = ponuda.getProjekt();

        PonudaDTO ponudaDTO = convertPonudaToDTO(ugovor.getPonuda());

        ProjektDTO projektDTO = new ProjektDTO(projekt);

        RecenzijaDTO recenzijaDTO = null;
        if (recenzija != null) {
            recenzijaDTO = new RecenzijaDTO(
                    recenzija.getOcjena(),
                    recenzija.getKomentar(),
                    recenzija.getDatumStvaranja()
            );
        }

        return new UgovorDTO(
                ugovor.getId(),
                ugovor.getStatus(),
                ugovor.getDatumPocetka(),
                ugovor.getDatumZavrsetka(),
                ponudaDTO,
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
                    PonudaDTO ponudaDTO = convertPonudaToDTO(ugovor.getPonuda());
                    ProjektDTO projektDTO = convertProjektToDTO(ugovor.getPonuda().getProjekt());
                    RecenzijaDTO recenzijaDTO = convertRecenzijaToDTO(ugovor.getRecenzija());

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            ponudaDTO,
                            projektDTO,
                            recenzijaDTO
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
                    PonudaDTO ponudaDTO = convertPonudaToDTO(ugovor.getPonuda());
                    ProjektDTO projektDTO = convertProjektToDTO(ugovor.getPonuda().getProjekt());
                    RecenzijaDTO recenzijaDTO = convertRecenzijaToDTO(ugovor.getRecenzija());

                    return new UgovorDTO(
                            ugovor.getId(),
                            ugovor.getStatus(),
                            ugovor.getDatumPocetka(),
                            ugovor.getDatumZavrsetka(),
                            ponudaDTO,
                            projektDTO,
                            recenzijaDTO
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

        PonudaDTO ponudaDTO = convertPonudaToDTO(ugovor.getPonuda());
        ProjektDTO projektDTO = convertProjektToDTO(ugovor.getPonuda().getProjekt());
        RecenzijaDTO recenzijaDTO = convertRecenzijaToDTO(ugovor.getRecenzija());


        return new UgovorDTO(
                savedUgovor.getId(),
                savedUgovor.getStatus(),
                savedUgovor.getDatumPocetka(),
                savedUgovor.getDatumZavrsetka(),
                ponudaDTO,
                projektDTO,
                recenzijaDTO
        );
    }

    @Transactional
    public UgovorDTO markUgovorAsFinished(Integer ugovorId) {
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor ne postoji za ID: " + ugovorId));

        ugovor.setDatumZavrsetka(LocalDate.now());
        ugovor.setStatus("zavrsen");

        Ugovor savedUgovor = ugovorRepository.save(ugovor);

        PonudaDTO ponudaDTO = convertPonudaToDTO(ugovor.getPonuda());
        ProjektDTO projektDTO = convertProjektToDTO(ugovor.getPonuda().getProjekt());
        RecenzijaDTO recenzijaDTO = convertRecenzijaToDTO(ugovor.getRecenzija());

        return new UgovorDTO(
                savedUgovor.getId(),
                savedUgovor.getStatus(),
                savedUgovor.getDatumPocetka(),
                savedUgovor.getDatumZavrsetka(),
                ponudaDTO,
                projektDTO,
                recenzijaDTO
        );
    }

    private PonudaDTO convertPonudaToDTO(Ponuda ponuda) {
        if (ponuda == null) return null;
        return new PonudaDTO(
                ponuda.getId(),
                ponuda.getStatus(),
                ponuda.getIznos(),
                ponuda.getPoruka(),
                ponuda.getRokZaPrihvacanje(),
                ponuda.getDatumStvaranja(),
                convertProjektToDTO(ponuda.getProjekt()),
                ponuda.getPonuditelj().getKorisnik().getOsoba() != null ? PonuditeljDTO.fromPonuditeljOsoba(ponuda.getPonuditelj())
                        : PonuditeljDTO.fromPonuditeljTvrtka(ponuda.getPonuditelj())
        );
    }

    private ProjektDTO convertProjektToDTO(Projekt projekt) {
        if (projekt == null) return null;
        return new ProjektDTO(projekt);
    }

    private RecenzijaDTO convertRecenzijaToDTO(Recenzija recenzija) {
        if (recenzija == null) return null;
        return new RecenzijaDTO(
                recenzija.getOcjena(),
                recenzija.getKomentar(),
                recenzija.getDatumStvaranja()
        );
    }
}
