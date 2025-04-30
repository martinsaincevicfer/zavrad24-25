package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.ProjektRepository;
import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjektService {
    @Autowired
    private final ProjektRepository projektRepository;

    public ProjektService(ProjektRepository projektRepository) {
        this.projektRepository = projektRepository;
    }

    @Transactional
    public List<ProjektDTO> getAllProjekti() {
        return projektRepository.findAll().stream()
                .map(ProjektDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<ProjektDTO> getProjektById(Integer id) {
        return projektRepository.findById(id)
                .map(ProjektDTO::new);
    }
}
