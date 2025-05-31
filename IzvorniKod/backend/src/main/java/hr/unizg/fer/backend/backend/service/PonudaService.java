package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.PonudaRepository;
import hr.unizg.fer.backend.backend.domain.Honorarac;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Ponuda;
import hr.unizg.fer.backend.backend.dto.PonudaDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PonudaService {
    private final PonudaRepository ponudaRepository;
    private final KorisnikRepository korisnikRepository;

    public PonudaService(PonudaRepository ponudaRepository, KorisnikRepository korisnikRepository) {
        this.ponudaRepository = ponudaRepository;
        this.korisnikRepository = korisnikRepository;
    }

    public List<PonudaDTO> getPonudeStvoreneOdUlogiranogKorisnika() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        var loggedInKorisnik = korisnikRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Prijavljeni korisnik nije pronađen!"));

        List<Ponuda> ponude = ponudaRepository.findAllByKlijent_Id(loggedInKorisnik.getId());

        return ponude.stream().map(ponuda -> {
            PonudaDTO dto = new PonudaDTO();
            dto.setId(ponuda.getId());
            dto.setKlijentId(ponuda.getKlijent().getId());
            dto.setHonoraracId(ponuda.getHonorarac().getId());
            dto.setNaziv(ponuda.getNaziv());
            dto.setOpis(ponuda.getOpis());
            dto.setBudzet(ponuda.getBudzet());
            dto.setRok(ponuda.getRok());
            dto.setStatus(ponuda.getStatus());
            dto.setDatumStvaranja(ponuda.getDatumStvaranja());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<PonudaDTO> getPonudeZaUlogiranogHonorarca() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        var loggedInKorisnik = korisnikRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Prijavljeni korisnik nije pronađen!"));

        var honoraracId = loggedInKorisnik.getId();

        List<Ponuda> ponude = ponudaRepository.findAllByHonorarac_Id(honoraracId);

        return ponude.stream().map(ponuda -> {
            PonudaDTO dto = new PonudaDTO();
            dto.setId(ponuda.getId());
            dto.setKlijentId(ponuda.getKlijent().getId());
            dto.setHonoraracId(ponuda.getHonorarac().getId());
            dto.setNaziv(ponuda.getNaziv());
            dto.setOpis(ponuda.getOpis());
            dto.setBudzet(ponuda.getBudzet());
            dto.setRok(ponuda.getRok());
            dto.setStatus(ponuda.getStatus());
            dto.setDatumStvaranja(ponuda.getDatumStvaranja());
            return dto;
        }).collect(Collectors.toList());
    }

    public PonudaDTO createPonuda(PonudaDTO ponudaDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        Korisnik loggedInKorisnik = korisnikRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Prijavljeni korisnik nije pronađen!"));

        Honorarac honorarac = new Honorarac();
        honorarac.setId(ponudaDTO.getHonoraracId());

        Ponuda ponuda = new Ponuda();
        ponuda.setNaziv(ponudaDTO.getNaziv());
        ponuda.setOpis(ponudaDTO.getOpis());
        ponuda.setBudzet(ponudaDTO.getBudzet());
        ponuda.setRok(ponudaDTO.getRok());
        ponuda.setKlijent(loggedInKorisnik);
        ponuda.setHonorarac(honorarac);
        ponuda.setStatus("poslana");
        ponuda.setDatumStvaranja(java.time.Instant.now());

        Ponuda savedPonuda = ponudaRepository.save(ponuda);

        PonudaDTO savedPonudaDTO = new PonudaDTO();
        savedPonudaDTO.setId(savedPonuda.getId());
        savedPonudaDTO.setKlijentId(loggedInKorisnik.getId());
        savedPonudaDTO.setHonoraracId(savedPonuda.getHonorarac().getId());
        savedPonudaDTO.setNaziv(savedPonuda.getNaziv());
        savedPonudaDTO.setOpis(savedPonuda.getOpis());
        savedPonudaDTO.setBudzet(savedPonuda.getBudzet());
        savedPonudaDTO.setRok(savedPonuda.getRok());
        savedPonudaDTO.setStatus(savedPonuda.getStatus());
        savedPonudaDTO.setDatumStvaranja(savedPonuda.getDatumStvaranja());

        return savedPonudaDTO;
    }
}