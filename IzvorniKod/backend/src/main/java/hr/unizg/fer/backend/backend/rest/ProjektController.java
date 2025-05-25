package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.domain.Projekt;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import hr.unizg.fer.backend.backend.service.ProjektService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/stvori")
    public ResponseEntity<ProjektDTO> createProjekt(@Valid @RequestBody ProjektDTO projektDTO) {
        ProjektDTO createdProjekt = projektService.createProjekt(projektDTO);
        return ResponseEntity.ok(createdProjekt);
    }

    @GetMapping("/moji-projekti")
    public ResponseEntity<List<ProjektDTO>> getProjektiZaUlogiranogKlijenta() {
        return ResponseEntity.ok(projektService.getProjektiZaKlijenta());
    }
}
