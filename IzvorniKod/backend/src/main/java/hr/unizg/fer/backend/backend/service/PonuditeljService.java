package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PonuditeljRepository;
import hr.unizg.fer.backend.backend.dao.UlogaRepository;
import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Ponuditelj;
import hr.unizg.fer.backend.backend.domain.Uloga;
import hr.unizg.fer.backend.backend.dto.PonuditeljDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PonuditeljService {
    private final PonuditeljRepository ponuditeljRepository;

    private final KorisnikRepository korisnikRepository;

    private final UlogaRepository ulogaRepository;

    private final VjestinaRepository vjestinaRepository;

    public PonuditeljService(PonuditeljRepository ponuditeljRepository, KorisnikRepository korisnikRepository, UlogaRepository ulogaRepository, VjestinaRepository vjestinaRepository) {
        this.ponuditeljRepository = ponuditeljRepository;
        this.korisnikRepository = korisnikRepository;
        this.ulogaRepository = ulogaRepository;
        this.vjestinaRepository = vjestinaRepository;
    }

    @Transactional
    public List<PonuditeljDTO> getAll() {
        return ponuditeljRepository.findAll().stream()
                .map(ponuditelj -> {
                    if (ponuditelj.getKorisnik().getOsoba() != null) {
                        return PonuditeljDTO.fromPonuditeljOsoba(ponuditelj);
                    } else {
                        return PonuditeljDTO.fromPonuditeljTvrtka(ponuditelj);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public PonuditeljDTO getById(Integer id) {
        Ponuditelj ponuditelj = ponuditeljRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ponuditelj nije pronađen - ID: " + id));

        if (ponuditelj.getKorisnik().getOsoba() != null) {
            return PonuditeljDTO.fromPonuditeljOsoba(ponuditelj);
        } else {
            return PonuditeljDTO.fromPonuditeljTvrtka(ponuditelj);
        }
    }

    @Transactional
    public PonuditeljDTO getByEmail(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen za ovaj email: " + email));

        Ponuditelj ponuditelj = korisnik.getPonuditelj();
        if (ponuditelj == null) {
            throw new SecurityException("Korisnik nije registriran kao ponuditelj!");
        }

        return PonuditeljDTO.basicInfo(ponuditelj);
    }

    @Transactional
    public void createPonuditelj(String email, PonuditeljDTO ponuditeljDTO) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen s ovim emailom: " + email));

        if (korisnik.getPonuditelj() != null) {
            throw new SecurityException("Korisnik je već registriran kao ponuditelj!");
        }

        Ponuditelj ponuditelj = new Ponuditelj();
        ponuditelj.setKorisnik(korisnik);
        ponuditelj.setKratkiOpis(ponuditeljDTO.getKratkiOpis());
        ponuditelj.setEdukacija(ponuditeljDTO.getEdukacija());
        ponuditelj.setIskustvo(ponuditeljDTO.getIskustvo());
        ponuditelj.setDatumStvaranja(Instant.now());
        ponuditelj.setVjestine(
                ponuditeljDTO.getVjestine().stream()
                        .map(vjestinaDTO -> vjestinaRepository.findById(vjestinaDTO.getId())
                                .orElseThrow(() -> new EntityNotFoundException("Vještina nije pronađena s ID-jem: " + vjestinaDTO.getId())))
                        .collect(Collectors.toSet())
        );

        ponuditeljRepository.save(ponuditelj);

        korisnik.setPonuditelj(ponuditelj);

        Uloga ponuditeljUloga = ulogaRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Uloga 'ponuditelj' nije pronađena"));
        korisnik.getUloge().add(ponuditeljUloga);

        korisnikRepository.save(korisnik);

        PonuditeljDTO.basicInfo(ponuditelj);
    }

    public void updatePonuditelj(String email, PonuditeljDTO dto) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));
        Ponuditelj ponuditelj = korisnik.getPonuditelj();
        if (ponuditelj == null) throw new SecurityException("Nije ponuditelj");
        ponuditelj.setKratkiOpis(dto.getKratkiOpis());
        ponuditelj.setEdukacija(dto.getEdukacija());
        ponuditelj.setIskustvo(dto.getIskustvo());
        ponuditelj.setVjestine(
                dto.getVjestine().stream()
                        .map(v -> vjestinaRepository.findById(v.getId())
                                .orElseThrow(() -> new RuntimeException("Vještina nije pronađena s ID-jem: " + v.getId())))
                        .collect(Collectors.toSet())
        );
        ponuditeljRepository.save(ponuditelj);
    }
}