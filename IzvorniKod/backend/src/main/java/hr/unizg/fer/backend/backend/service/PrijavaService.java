package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PrijavaRepository;
import hr.unizg.fer.backend.backend.dao.ProjektRepository;
import hr.unizg.fer.backend.backend.domain.Honorarac;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Prijava;
import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.dto.*;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrijavaService {

    private final PrijavaRepository prijavaRepository;
    private final ProjektRepository projektRepository;
    private final KorisnikRepository korisnikRepository;

    public PrijavaService(PrijavaRepository prijavaRepository, ProjektRepository projektRepository, KorisnikRepository korisnikRepository) {
        this.prijavaRepository = prijavaRepository;
        this.projektRepository = projektRepository;
        this.korisnikRepository = korisnikRepository;
    }

    @Transactional
    public PrijavaDTO findById(Integer prijavaId) {
        Prijava prijava = prijavaRepository.findById(prijavaId)
                .orElseThrow(() -> new IllegalArgumentException("Prijava not found"));
        return mapToDTO(prijava);
    }

    @Transactional
    public List<PrijavaDTO> findAllByLoggedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Honorarac honorarac = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Honorarac not found"))
                .getHonorarac();

        return prijavaRepository.findByKorisnik(honorarac).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public List<PrijavaDTO> findAllForProjectByLoggedUser(Integer projektId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Korisnik korisnik = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));

        Projekt projekt = projektRepository.findById(projektId)
                .orElseThrow(() -> new IllegalArgumentException("Projekt not found"));

        if (!projekt.getKorisnik().equals(korisnik)) {
            throw new IllegalArgumentException("You can only access applications for your own projects");
        }

        return prijavaRepository.findByProjekt(projekt).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public Prijava createPrijava(PrijavaFormDTO prijavaFormDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Honorarac honorarac = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Honorarac not found"))
                .getHonorarac();

        Prijava prijava = new Prijava();
        prijava.setIznos(prijavaFormDTO.getIznos());
        prijava.setPoruka(prijavaFormDTO.getPoruka());
        prijava.setDatumStvaranja(Instant.now());
        prijava.setStatus("aktivna");
        prijava.setProjekt(projektRepository.findById(prijavaFormDTO.getProjektId())
                .orElseThrow(() -> new IllegalArgumentException("Projekt not found")));
        prijava.setKorisnik(honorarac);

        return prijavaRepository.save(prijava);
    }

    private PrijavaDTO mapToDTO(Prijava prijava) {
        Projekt projekt = prijava.getProjekt();
        Honorarac honorarac = prijava.getKorisnik();

        ProjektDTO projektDTO = new ProjektDTO(
                projekt.getId(),
                projekt.getNaziv(),
                projekt.getOpis(),
                projekt.getBudzet(),
                projekt.getRok(),
                projekt.getDatumStvaranja(),
                projekt.getKorisnik().getId(),
                projekt.getVjestine().stream().map(VjestinaDTO::new).collect(Collectors.toSet())
        );

        HonoraracDTO honoraracDTO;
        if (honorarac.getKorisnik().getOsoba() != null) {
            honoraracDTO = HonoraracDTO.fromHonoraracOsoba(honorarac);
        } else if (honorarac.getKorisnik().getTvrtka() != null) {
            honoraracDTO = HonoraracDTO.fromHonoraracTvrtka(honorarac);
        } else {
            honoraracDTO = HonoraracDTO.basicInfo(honorarac);
        }

        return new PrijavaDTO(
                prijava.getId(),
                prijava.getStatus(),
                prijava.getIznos(),
                prijava.getPoruka(),
                prijava.getDatumStvaranja(),
                projektDTO,
                honoraracDTO
        );
    }
}