package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.ProjektRepository;
import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.domain.Vjestina;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import hr.unizg.fer.backend.backend.dto.ProjektFormDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjektService {
    private final ProjektRepository projektRepository;
    private final KorisnikRepository korisnikRepository;
    private final VjestinaRepository vjestinaRepository;

    public ProjektService(ProjektRepository projektRepository, KorisnikRepository korisnikRepository, VjestinaRepository vjestinaRepository) {
        this.projektRepository = projektRepository;
        this.korisnikRepository = korisnikRepository;
        this.vjestinaRepository = vjestinaRepository;
    }

    @Transactional
    public List<ProjektDTO> getAllProjekti() {
        return projektRepository.findAll().stream()
                .map(ProjektDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjektDTO getProjektById(Integer id) {
        return projektRepository.findById(id)
                .map(ProjektDTO::new).orElseThrow(() -> new EntityNotFoundException("Nije pronađen projekt sa id: " + id));
    }

    @Transactional
    public ProjektFormDTO createProjekt(ProjektDTO projektDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen korisnik: " + email));

        boolean isKlijent = korisnik.getUloge().stream()
                .anyMatch(uloga -> uloga.getNaziv().equals("klijent"));

        if (!isKlijent) {
            throw new SecurityException("Pristup odbijen: korisnik nije klijent.");
        }

        Projekt projekt = new Projekt();
        projekt.setNaziv(projektDTO.getNaziv());
        projekt.setOpis(projektDTO.getOpis());
        projekt.setBudzet(projektDTO.getBudzet());
        projekt.setRokIzrade(projektDTO.getRok());
        projekt.setDatumStvaranja(Instant.now());
        projekt.setNarucitelj(korisnik);

        if (projektDTO.getVjestine() != null && !projektDTO.getVjestine().isEmpty()) {
            Set<Vjestina> vjestine = projektDTO.getVjestine().stream()
                    .map(vjestinaDTO -> vjestinaRepository.findById(vjestinaDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Vještina s ID-jem " + vjestinaDTO.getId() + " nije pronađena"))
                    ).collect(Collectors.toSet());
            projekt.setVjestine(vjestine);
        }

        Projekt savedProjekt = projektRepository.save(projekt);
        return new ProjektFormDTO(savedProjekt);
    }

    @Transactional
    public List<ProjektDTO> getProjektiZaKlijenta() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen korisnik: " + email));

        boolean isKlijent = korisnik.getUloge().stream()
                .anyMatch(uloga -> uloga.getNaziv().equalsIgnoreCase("klijent"));

        if (!isKlijent) {
            throw new SecurityException("Pristup odbijen: korisnik nije klijent.");
        }

        return korisnik.getProjekti().stream()
                .map(ProjektDTO::new)
                .collect(Collectors.toList());
    }
}
