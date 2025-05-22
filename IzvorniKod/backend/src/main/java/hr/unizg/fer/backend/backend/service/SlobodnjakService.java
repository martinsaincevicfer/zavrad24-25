package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.SlobodnjakRepository;
import hr.unizg.fer.backend.backend.dao.UlogaRepository;
import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Slobodnjak;
import hr.unizg.fer.backend.backend.domain.Uloga;
import hr.unizg.fer.backend.backend.dto.SlobodnjakDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlobodnjakService {
    @Autowired
    private final SlobodnjakRepository slobodnjakRepository;

    @Autowired
    private KorisnikRepository korisnikRepository;

    @Autowired
    private UlogaRepository ulogaRepository;

    @Autowired
    private VjestinaRepository vjestinaRepository;

    public SlobodnjakService(SlobodnjakRepository slobodnjakRepository) {
        this.slobodnjakRepository = slobodnjakRepository;
    }

    @Transactional
    public List<SlobodnjakDTO> getAll() {
        return slobodnjakRepository.findAll().stream()
                .map(slobodnjak -> {
                    if (slobodnjak.getKorisnik().getOsoba() != null) {
                        return SlobodnjakDTO.fromSlobodnjakOsoba(slobodnjak);
                    } else {
                        return SlobodnjakDTO.fromSlobodnjakTvrtka(slobodnjak);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public SlobodnjakDTO getById(Integer id) {
        Slobodnjak slobodnjak = slobodnjakRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slobodnjak nije pronađen - ID: " + id));

        if (slobodnjak.getKorisnik().getOsoba() != null) {
            return SlobodnjakDTO.fromSlobodnjakOsoba(slobodnjak);
        } else {
            return SlobodnjakDTO.fromSlobodnjakTvrtka(slobodnjak);
        }
    }

    @Transactional
    public SlobodnjakDTO getByEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen za ovaj email: " + email));

        Slobodnjak slobodnjak = korisnik.getSlobodnjak();
        if (slobodnjak == null) {
            throw new RuntimeException("Korisnik nije registriran kao slobodnjak!");
        }

        return SlobodnjakDTO.basicInfo(slobodnjak);
    }

    @Transactional
    public SlobodnjakDTO createSlobodnjak(String email, SlobodnjakDTO slobodnjakDTO) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen s ovim emailom: " + email));

        if (korisnik.getSlobodnjak() != null) {
            throw new RuntimeException("Korisnik je već registriran kao Slobodnjak!");
        }

        Slobodnjak slobodnjak = new Slobodnjak();
        slobodnjak.setKorisnik(korisnik);
        slobodnjak.setKratkiOpis(slobodnjakDTO.getKratkiOpis());
        slobodnjak.setEdukacija(slobodnjakDTO.getEdukacija());
        slobodnjak.setIskustvo(slobodnjakDTO.getIskustvo());
        slobodnjak.setDatumStvaranja(Instant.now());
        slobodnjak.setVjestine(
                slobodnjakDTO.getVjestine().stream()
                        .map(vjestinaDTO -> vjestinaRepository.findById(vjestinaDTO.getId())
                                .orElseThrow(() -> new RuntimeException("Vještina nije pronađena s ID-jem: " + vjestinaDTO.getId())))
                        .collect(Collectors.toSet())
        );

        slobodnjakRepository.save(slobodnjak);

        korisnik.setSlobodnjak(slobodnjak);

        Uloga slobodnjakUloga = ulogaRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Uloga 'slobodnjak' nije pronađena"));
        korisnik.getUloge().add(slobodnjakUloga);

        korisnikRepository.save(korisnik);

        return SlobodnjakDTO.basicInfo(slobodnjak);
    }
}