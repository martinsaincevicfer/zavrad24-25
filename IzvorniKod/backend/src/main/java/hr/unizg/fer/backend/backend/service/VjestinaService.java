package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.VjestinaRepository;
import hr.unizg.fer.backend.backend.domain.Vjestina;
import hr.unizg.fer.backend.backend.dto.VjestinaDTO;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VjestinaService {

    private final VjestinaRepository vjestinaRepository;

    public VjestinaService(VjestinaRepository vjestinaRepository) {
        this.vjestinaRepository = vjestinaRepository;
    }

    public List<VjestinaDTO> searchVjestine(String naziv) {
        Specification<Vjestina> spec = Specification.where(null);

        if (naziv != null) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("naziv")), "%" + naziv.toLowerCase() + "%"));
        }

        return vjestinaRepository.findAll(spec).stream()
                .map(VjestinaDTO::new)
                .collect(Collectors.toList());
    }
}