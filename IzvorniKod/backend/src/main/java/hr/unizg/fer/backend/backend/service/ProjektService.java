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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static hr.unizg.fer.backend.backend.dao.ProjektSpecification.*;

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
    public List<ProjektDTO> searchProjekti(String naziv, BigDecimal budzet, LocalDate rokIzrade, Set<Integer> vjestine) {
        Set<Vjestina> vjestinaEntities = vjestine == null ? null :
                new HashSet<>(vjestinaRepository.findAllById(vjestine));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Specification<Projekt> spec = Specification.where(isOtvoren())
                .and(hasNaziv(naziv))
                .and(hasBudzet(budzet))
                .and(hasRokIzrade(rokIzrade))
                .and(hasVjestine(vjestinaEntities))
                .and(notNarucitelj(email));

        return projektRepository.findAll(spec)
                .stream()
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

        boolean jeNarucitelj = korisnik.getUloge().stream()
                .anyMatch(uloga -> uloga.getNaziv().equals("narucitelj"));

        if (!jeNarucitelj) {
            throw new SecurityException("Pristup odbijen: korisnik nije narucitelj.");
        }

        Projekt projekt = new Projekt();
        projekt.setNaziv(projektDTO.getNaziv());
        projekt.setOpis(projektDTO.getOpis());
        projekt.setBudzet(projektDTO.getBudzet());
        projekt.setRokIzrade(projektDTO.getRokIzrade());
        projekt.setDatumStvaranja(Instant.now());
        projekt.setStatus("otvoren");
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
    public List<ProjektDTO> getProjektiZaNarucitelja() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen korisnik: " + email));

        boolean jeNarucitelj = korisnik.getUloge().stream()
                .anyMatch(uloga -> uloga.getNaziv().equalsIgnoreCase("narucitelj"));

        if (!jeNarucitelj) {
            throw new SecurityException("Pristup odbijen: korisnik nije narucitelj.");
        }

        return korisnik.getProjekti().stream()
                .map(ProjektDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void zatvoriProjekt(Integer id) {
        Projekt projekt = projektRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen projekt sa id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (!Objects.equals(projekt.getNarucitelj().getEmail(), email)) {
            throw new SecurityException("Niste narucitelj ovog projekta!");
        }

        projekt.setStatus("zatvoren");
        projektRepository.save(projekt);
    }

    @Transactional
    public ProjektFormDTO updateProjekt(Integer id, ProjektDTO projektDTO) {
        Projekt projekt = projektRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen projekt sa id: " + id));
        if (projekt.getPonude().stream().anyMatch(ponuda -> ponuda.getUgovor() != null)) {
            throw new IllegalStateException("Projekt ima ugovor i ne može se mijenjati.");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (!Objects.equals(projekt.getNarucitelj().getEmail(), email)) {
            throw new SecurityException("Niste narucitelj ovog projekta!");
        }

        projekt.setNaziv(projektDTO.getNaziv());
        projekt.setOpis(projektDTO.getOpis());
        projekt.setBudzet(projektDTO.getBudzet());
        projekt.setRokIzrade(projektDTO.getRokIzrade());
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
    public void deleteProjekt(Integer id) {
        Projekt projekt = projektRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nije pronađen projekt sa id: " + id));
        if (projekt.getPonude().stream().anyMatch(ponuda -> ponuda.getUgovor() != null)) {
            throw new IllegalStateException("Projekt ima ugovor i ne može se obrisati.");
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (!Objects.equals(projekt.getNarucitelj().getEmail(), email)) {
            throw new SecurityException("Niste narucitelj ovog projekta!");
        }
        projektRepository.delete(projekt);
    }
}
