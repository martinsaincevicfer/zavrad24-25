package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.RecenzijaDTO;
import hr.unizg.fer.backend.backend.dto.RecenzijaFormDTO;
import hr.unizg.fer.backend.backend.service.RecenzijaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recenzije")
public class RecenzijaController {
    private final RecenzijaService recenzijaService;

    public RecenzijaController(RecenzijaService recenzijaService) {
        this.recenzijaService = recenzijaService;
    }

    @GetMapping("/ponuditelj/{id}")
    public ResponseEntity<List<RecenzijaDTO>> getRecenzijeForPonuditelj(@PathVariable Integer id) {
        List<RecenzijaDTO> recenzije = recenzijaService.getRecenzijeForPonuditelj(id);
        return ResponseEntity.ok(recenzije);
    }

    @PostMapping("/stvori")
    public ResponseEntity<?> createRecenzija(
            @RequestBody RecenzijaFormDTO dto) {
        recenzijaService.createRecenzija(dto);
        return ResponseEntity.ok().build();
    }
}
