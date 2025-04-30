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

    @Transactional()
    public List<SlobodnjakDTO> getAllSlobodnjaci() {
        return slobodnjakRepository.findAll().stream()
                .map(SlobodnjakDTO::new)
                .collect(Collectors.toList());
    }
}
