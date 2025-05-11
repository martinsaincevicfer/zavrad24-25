package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.SlobodnjakRepository;
import hr.unizg.fer.backend.backend.domain.Slobodnjak;
import hr.unizg.fer.backend.backend.dto.SlobodnjakDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlobodnjakService {
    @Autowired
    private final SlobodnjakRepository slobodnjakRepository;

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
}