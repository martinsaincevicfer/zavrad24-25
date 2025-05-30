package hr.unizg.fer.backend.backend.rest;


import hr.unizg.fer.backend.backend.dto.PrijavaDTO;
import hr.unizg.fer.backend.backend.dto.PrijavaFormDTO;
import hr.unizg.fer.backend.backend.domain.Prijava;
import hr.unizg.fer.backend.backend.service.PrijavaService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prijave")
public class PrijavaController {

    private final PrijavaService prijavaService;

    public PrijavaController(PrijavaService prijavaService) {
        this.prijavaService = prijavaService;
    }

    @GetMapping("/{prijavaId}")
    public ResponseEntity<PrijavaDTO> getApplicationDetails(@PathVariable Integer prijavaId) {
        PrijavaDTO prijavaDTO = prijavaService.findById(prijavaId);
        return ResponseEntity.ok(prijavaDTO);
    }

    @GetMapping("/moje-prijave")
    public ResponseEntity<List<PrijavaDTO>> getOwnApplications() {
        List<PrijavaDTO> prijave = prijavaService.findAllByLoggedUser();
        return ResponseEntity.ok(prijave);
    }

    @GetMapping("/projekt/{projektId}")
    public ResponseEntity<List<PrijavaDTO>> getApplicationsForProject(@PathVariable Integer projektId) {
        List<PrijavaDTO> prijave = prijavaService.findAllForProjectByLoggedUser(projektId);
        return ResponseEntity.ok(prijave);
    }

    @PostMapping("/stvori")
    public ResponseEntity<Prijava> createPrijava(@Validated @RequestBody PrijavaFormDTO prijavaFormDTO) {
        Prijava novaPrijava = prijavaService.createPrijava(prijavaFormDTO);
        // return ResponseEntity.ok(novaPrijava);
        return ResponseEntity.ok().build();
    }
}