package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PonudaRepository;
import hr.unizg.fer.backend.backend.dao.ProjektRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Ponuda;
import hr.unizg.fer.backend.backend.domain.Ponuditelj;
import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.dto.PonudaDTO;
import hr.unizg.fer.backend.backend.dto.PonudaFormDTO;
import hr.unizg.fer.backend.backend.dto.PonuditeljDTO;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PonudaService {

    private final PonudaRepository ponudaRepository;
    private final ProjektRepository projektRepository;
    private final KorisnikRepository korisnikRepository;

    public PonudaService(PonudaRepository ponudaRepository, ProjektRepository projektRepository, KorisnikRepository korisnikRepository) {
        this.ponudaRepository = ponudaRepository;
        this.projektRepository = projektRepository;
        this.korisnikRepository = korisnikRepository;
    }

    @Transactional
    public PonudaDTO findById(Integer ponudaId) {
        Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(() -> new IllegalArgumentException("Ponuda not found"));
        return mapToDTO(ponuda);
    }

    @Transactional
    public List<PonudaDTO> findAllByLoggedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Ponuditelj ponuditelj = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Ponuditelj not found"))
                .getPonuditelj();

        return ponudaRepository.findByPonuditelj(ponuditelj).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public List<PonudaDTO> findAllForProjectByLoggedUser(Integer projektId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Korisnik korisnik = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));

        Projekt projekt = projektRepository.findById(projektId)
                .orElseThrow(() -> new IllegalArgumentException("Projekt not found"));

        if (!projekt.getNarucitelj().equals(korisnik)) {
            throw new IllegalArgumentException("You can only access applications for your own projects");
        }

        return ponudaRepository.findByProjekt(projekt).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public void createPonuda(PonudaFormDTO ponudaFormDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Ponuditelj ponuditelj = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Ponuditelj not found"))
                .getPonuditelj();

        Ponuda ponuda = new Ponuda();
        ponuda.setIznos(ponudaFormDTO.getIznos());
        ponuda.setPoruka(ponudaFormDTO.getPoruka());
        ponuda.setDatumStvaranja(Instant.now());
        ponuda.setStatus("aktivna");
        ponuda.setRokZaPrihvacanje(ponuda.getDatumStvaranja().plus(7, ChronoUnit.DAYS));
        ponuda.setProjekt(projektRepository.findById(ponudaFormDTO.getProjektId())
                .orElseThrow(() -> new IllegalArgumentException("Projekt not found")));
        ponuda.setPonuditelj(ponuditelj);

        ponudaRepository.save(ponuda);
    }

    private PonudaDTO mapToDTO(Ponuda ponuda) {
        Projekt projekt = ponuda.getProjekt();
        Ponuditelj ponuditelj = ponuda.getPonuditelj();

        ProjektDTO projektDTO = new ProjektDTO(projekt);
        
        PonuditeljDTO ponuditeljDTO;
        if (ponuditelj.getKorisnik().getOsoba() != null) {
            ponuditeljDTO = PonuditeljDTO.fromPonuditeljOsoba(ponuditelj);
        } else if (ponuditelj.getKorisnik().getTvrtka() != null) {
            ponuditeljDTO = PonuditeljDTO.fromPonuditeljTvrtka(ponuditelj);
        } else {
            ponuditeljDTO = PonuditeljDTO.basicInfo(ponuditelj);
        }

        return new PonudaDTO(
                ponuda.getId(),
                ponuda.getStatus(),
                ponuda.getIznos(),
                ponuda.getPoruka(),
                ponuda.getRokZaPrihvacanje(),
                ponuda.getDatumStvaranja(),
                projektDTO,
                ponuditeljDTO
        );
    }
}