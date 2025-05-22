package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import hr.unizg.fer.backend.backend.service.ProjektService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projekti")
public class ProjektController {
    @Autowired
    private final ProjektService projektService;

    public ProjektController(ProjektService projektService) {
        this.projektService = projektService;
    }

    @GetMapping
    public ResponseEntity<List<ProjektDTO>> getAllProjekti() {
        return ResponseEntity.ok(projektService.getAllProjekti());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjektDTO> getProjektById(@PathVariable Integer id) {
        return ResponseEntity.ok(projektService.getProjektById(id)) ;
    }
}
