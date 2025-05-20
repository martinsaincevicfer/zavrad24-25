package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Vjestina;
import hr.unizg.fer.backend.backend.dto.VjestinaDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VjestinaService {

    private final VjestinaRepository vjestinaRepository;

    public VjestinaService(VjestinaRepository vjestinaRepository) {
        this.vjestinaRepository = vjestinaRepository;
    }

    public List<VjestinaDTO> getAllVjestine() {
        List<Vjestina> vjestine = vjestinaRepository.findAll();
        return vjestine.stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toList());
    }
}