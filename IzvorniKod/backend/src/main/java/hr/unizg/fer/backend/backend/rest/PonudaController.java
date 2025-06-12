package hr.unizg.fer.backend.backend.rest;


import hr.unizg.fer.backend.backend.domain.Ponuda;
import hr.unizg.fer.backend.backend.dto.PonudaDTO;
import hr.unizg.fer.backend.backend.dto.PonudaFormDTO;
import hr.unizg.fer.backend.backend.service.PonudaService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ponude")
public class PonudaController {

    private final PonudaService ponudaService;

    public PonudaController(PonudaService ponudaService) {
        this.ponudaService = ponudaService;
    }

    @GetMapping("/{ponudaId}")
    public ResponseEntity<PonudaDTO> getApplicationDetails(@PathVariable Integer ponudaId) {
        PonudaDTO ponudaDTO = ponudaService.findById(ponudaId);
        return ResponseEntity.ok(ponudaDTO);
    }

    @GetMapping("/moje-ponude")
    public ResponseEntity<List<PonudaDTO>> getOwnApplications() {
        List<PonudaDTO> ponude = ponudaService.findAllByLoggedUser();
        return ResponseEntity.ok(ponude);
    }

    @GetMapping("/projekt/{projektId}")
    public ResponseEntity<List<PonudaDTO>> getApplicationsForProject(@PathVariable Integer projektId) {
        List<PonudaDTO> ponude = ponudaService.findAllForProject(projektId);
        return ResponseEntity.ok(ponude);
    }

    @PostMapping("/stvori")
    public ResponseEntity<Ponuda> createPonuda(@Validated @RequestBody PonudaFormDTO ponudaFormDTO) {
        ponudaService.createPonuda(ponudaFormDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{ponudaId}")
    public ResponseEntity<PonudaDTO> updatePonuda(@PathVariable Integer ponudaId, @Validated @RequestBody PonudaFormDTO ponudaFormDTO) {
        PonudaDTO updated = ponudaService.updatePonuda(ponudaId, ponudaFormDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{ponudaId}")
    public ResponseEntity<Void> deletePonuda(@PathVariable Integer ponudaId) {
        ponudaService.deletePonuda(ponudaId);
        return ResponseEntity.noContent().build();
    }
}