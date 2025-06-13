package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PonudaRepository;
import hr.unizg.fer.backend.backend.dao.ProjektRepository;
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
        updateStatusIfExpired(ponuda);
        return mapToDTO(ponuda);
    }

    @Transactional
    public List<PonudaDTO> findAllByLoggedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Ponuditelj ponuditelj = korisnikRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Ponuditelj not found"))
                .getPonuditelj();

        List<Ponuda> ponude = ponudaRepository.findByPonuditelj(ponuditelj);
        ponude.forEach(this::updateStatusIfExpired);
        return ponude.stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public List<PonudaDTO> findAllForProject(Integer projektId) {
        Projekt projekt = projektRepository.findById(projektId)
                .orElseThrow(() -> new IllegalArgumentException("Projekt not found"));

        List<Ponuda> ponude = ponudaRepository.findByProjekt(projekt);
        ponude.forEach(this::updateStatusIfExpired);
        return ponude.stream().map(this::mapToDTO).toList();
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

    @Transactional
    public PonudaDTO updatePonuda(Integer ponudaId, PonudaFormDTO ponudaFormDTO) {
        Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(() -> new IllegalArgumentException("Ponuda not found"));

        if ("prihvacena".equalsIgnoreCase(ponuda.getStatus())) {
            throw new IllegalStateException("Accepted offer cannot be edited.");
        }

        ponuda.setIznos(ponudaFormDTO.getIznos());
        ponuda.setPoruka(ponudaFormDTO.getPoruka());

        ponudaRepository.save(ponuda);
        return mapToDTO(ponuda);
    }

    @Transactional
    public void deletePonuda(Integer ponudaId) {
        Ponuda ponuda = ponudaRepository.findById(ponudaId)
                .orElseThrow(() -> new IllegalArgumentException("Ponuda not found"));

        if ("prihvacena".equalsIgnoreCase(ponuda.getStatus())) {
            throw new IllegalStateException("Accepted offer cannot be deleted.");
        }

        ponudaRepository.delete(ponuda);
    }

    private void updateStatusIfExpired(Ponuda ponuda) {
        if ("aktivna".equalsIgnoreCase(ponuda.getStatus()) &&
                ponuda.getRokZaPrihvacanje() != null &&
                Instant.now().isAfter(ponuda.getRokZaPrihvacanje())) {
            ponuda.setStatus("istekla");
            ponudaRepository.save(ponuda);
        }
    }
}