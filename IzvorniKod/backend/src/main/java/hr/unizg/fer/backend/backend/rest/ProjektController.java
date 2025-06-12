package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.domain.Vjestina;
import hr.unizg.fer.backend.backend.dto.ProjektDTO;
import hr.unizg.fer.backend.backend.dto.ProjektFormDTO;
import hr.unizg.fer.backend.backend.service.ProjektService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projekti")
public class ProjektController {
    private final ProjektService projektService;

    public ProjektController(ProjektService projektService) {
        this.projektService = projektService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjektDTO> getProjektById(@PathVariable Integer id) {
        return ResponseEntity.ok(projektService.getProjektById(id));
    }

    @PostMapping("/stvori")
    public ResponseEntity<ProjektFormDTO> createProjekt(@Valid @RequestBody ProjektDTO projektDTO) {
        ProjektFormDTO createdProjekt = projektService.createProjekt(projektDTO);
        return ResponseEntity.ok(createdProjekt);
    }

    @GetMapping("/moji-projekti")
    public ResponseEntity<List<ProjektDTO>> getProjektiZaUlogiranogKlijenta() {
        return ResponseEntity.ok(projektService.getProjektiZaKlijenta());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProjektDTO>> searchProjekti(
            @RequestParam(required = false) String naziv,
            @RequestParam(required = false) BigDecimal budzet,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate rokIzrade,
            @RequestParam(required = false) Set<Vjestina> vjestine
    ) {
        return ResponseEntity.ok(projektService.searchProjekti(naziv, budzet, rokIzrade, vjestine));
    }

    @PatchMapping("/{id}/zatvori")
    public ResponseEntity<Void> zatvoriProjekt(@PathVariable Integer id) {
        projektService.zatvoriProjekt(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjektFormDTO> updateProjekt(@PathVariable Integer id, @Valid @RequestBody ProjektDTO projektDTO) {
        ProjektFormDTO updatedProjekt = projektService.updateProjekt(id, projektDTO);
        return ResponseEntity.ok(updatedProjekt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable Integer id) {
        projektService.deleteProjekt(id);
        return ResponseEntity.noContent().build();
    }
}
