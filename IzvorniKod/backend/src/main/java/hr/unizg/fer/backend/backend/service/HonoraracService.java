package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.HonoraracRepository;
import hr.unizg.fer.backend.backend.dao.UlogaRepository;
import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Honorarac;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Uloga;
import hr.unizg.fer.backend.backend.dto.HonoraracDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HonoraracService {
    @Autowired
    private final HonoraracRepository honoraracRepository;

    @Autowired
    private KorisnikRepository korisnikRepository;

    @Autowired
    private UlogaRepository ulogaRepository;

    @Autowired
    private VjestinaRepository vjestinaRepository;

    public HonoraracService(HonoraracRepository honoraracRepository) {
        this.honoraracRepository = honoraracRepository;
    }

    @Transactional
    public List<HonoraracDTO> getAll() {
        return honoraracRepository.findAll().stream()
                .map(honorarac -> {
                    if (honorarac.getKorisnik().getOsoba() != null) {
                        return HonoraracDTO.fromHonoraracOsoba(honorarac);
                    } else {
                        return HonoraracDTO.fromHonoraracTvrtka(honorarac);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public HonoraracDTO getById(Integer id) {
        Honorarac honorarac = honoraracRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Honorarac nije pronađen - ID: " + id));

        if (honorarac.getKorisnik().getOsoba() != null) {
            return HonoraracDTO.fromHonoraracOsoba(honorarac);
        } else {
            return HonoraracDTO.fromHonoraracTvrtka(honorarac);
        }
    }

    @Transactional
    public HonoraracDTO getByEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen za ovaj email: " + email));

        Honorarac honorarac = korisnik.getHonorarac();
        if (honorarac == null) {
            throw new RuntimeException("Korisnik nije registriran kao honorarac!");
        }

        return HonoraracDTO.basicInfo(honorarac);
    }

    @Transactional
    public HonoraracDTO createHonorarac(String email, HonoraracDTO honoraracDTO) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen s ovim emailom: " + email));

        if (korisnik.getHonorarac() != null) {
            throw new RuntimeException("Korisnik je već registriran kao Honorarac!");
        }

        Honorarac honorarac = new Honorarac();
        honorarac.setKorisnik(korisnik);
        honorarac.setKratkiOpis(honoraracDTO.getKratkiOpis());
        honorarac.setEdukacija(honoraracDTO.getEdukacija());
        honorarac.setIskustvo(honoraracDTO.getIskustvo());
        honorarac.setDatumStvaranja(Instant.now());
        honorarac.setVjestine(
                honoraracDTO.getVjestine().stream()
                        .map(vjestinaDTO -> vjestinaRepository.findById(vjestinaDTO.getId())
                                .orElseThrow(() -> new RuntimeException("Vještina nije pronađena s ID-jem: " + vjestinaDTO.getId())))
                        .collect(Collectors.toSet())
        );

        honoraracRepository.save(honorarac);

        korisnik.setHonorarac(honorarac);

        Uloga honoraracUloga = ulogaRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Uloga 'honorarac' nije pronađena"));
        korisnik.getUloge().add(honoraracUloga);

        korisnikRepository.save(korisnik);

        return HonoraracDTO.basicInfo(honorarac);
    }
}