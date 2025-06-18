package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.RecenzijaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Recenzija;
import hr.unizg.fer.backend.backend.domain.Ugovor;
import hr.unizg.fer.backend.backend.dto.RecenzijaDTO;
import hr.unizg.fer.backend.backend.dto.RecenzijaFormDTO;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RecenzijaService {
    private final RecenzijaRepository recenzijaRepository;
    private final UgovorRepository ugovorRepository;
    private final KorisnikRepository korisnikRepository;

    public RecenzijaService(RecenzijaRepository recenzijaRepository, UgovorRepository ugovorRepository, KorisnikRepository korisnikRepository) {
        this.recenzijaRepository = recenzijaRepository;
        this.ugovorRepository = ugovorRepository;
        this.korisnikRepository = korisnikRepository;
    }

    @Transactional
    public void createRecenzija(RecenzijaFormDTO recenzijaFormDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));

        Ugovor ugovor = ugovorRepository.findById(recenzijaFormDTO.getUgovorId())
                .orElseThrow(() -> new IllegalArgumentException("Ugovor not found"));

        if (!ugovor.getPonuda().getProjekt().getNarucitelj().equals(korisnik)) {
            throw new IllegalArgumentException("Ulogirani korisnik nije vlasnik projekta!");
        }

        Recenzija recenzija = new Recenzija();
        recenzija.setOcjena(recenzijaFormDTO.getOcjena());
        recenzija.setKomentar(recenzijaFormDTO.getKomentar());
        recenzija.setDatumStvaranja(Instant.now());
        recenzija.setUgovor(ugovor);

        ugovor.setRecenzija(recenzija);

        recenzijaRepository.save(recenzija);
    }

    @Transactional
    public List<RecenzijaDTO> getRecenzijeForPonuditelj(Integer ponuditeljId) {
        List<Ugovor> ugovori = ugovorRepository.findByPonuda_Ponuditelj_Id(ponuditeljId);
        return ugovori.stream()
                .map(Ugovor::getRecenzija)
                .filter(Objects::nonNull)
                .map(recenzija -> {
                    String naruciteljIme;
                    var narucitelj = recenzija.getUgovor().getPonuda().getProjekt().getNarucitelj();
                    if (narucitelj.getOsoba() != null) {
                        naruciteljIme = narucitelj.getOsoba().getIme() + " " + narucitelj.getOsoba().getPrezime();
                    } else if (narucitelj.getTvrtka() != null) {
                        naruciteljIme = narucitelj.getTvrtka().getNazivTvrtke();
                    } else {
                        naruciteljIme = "";
                    }

                    return new RecenzijaDTO(
                            recenzija.getOcjena(),
                            recenzija.getKomentar(),
                            recenzija.getDatumStvaranja(),
                            naruciteljIme
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateRecenzija(Integer ugovorId, RecenzijaFormDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor not found"));

        if (!ugovor.getPonuda().getProjekt().getNarucitelj().equals(korisnik)) {
            throw new IllegalArgumentException("Ulogirani korisnik nije vlasnik projekta!");
        }

        Recenzija recenzija = ugovor.getRecenzija();
        if (recenzija == null) {
            throw new IllegalArgumentException("Recenzija ne postoji za ovaj ugovor!");
        }

        recenzija.setOcjena(dto.getOcjena());
        recenzija.setKomentar(dto.getKomentar());
        recenzijaRepository.save(recenzija);
    }

    @Transactional
    public void deleteRecenzija(Integer ugovorId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));
        Ugovor ugovor = ugovorRepository.findById(ugovorId)
                .orElseThrow(() -> new IllegalArgumentException("Ugovor not found"));

        if (!ugovor.getPonuda().getProjekt().getNarucitelj().equals(korisnik)) {
            throw new IllegalArgumentException("Ulogirani korisnik nije vlasnik projekta!");
        }

        Recenzija recenzija = ugovor.getRecenzija();
        if (recenzija != null) {
            ugovor.setRecenzija(null);
            recenzijaRepository.delete(recenzija);
        }
    }
}
