package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.ProjektRepository;
import hr.unizg.fer.backend.backend.domain.Projekt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjektService {
    @Autowired
    private final ProjektRepository projektRepository;

    public ProjektService(ProjektRepository projektRepository) {
        this.projektRepository = projektRepository;
    }

    public List<Projekt> getAllProjekti() {
        return projektRepository.findAll();
    }
}
