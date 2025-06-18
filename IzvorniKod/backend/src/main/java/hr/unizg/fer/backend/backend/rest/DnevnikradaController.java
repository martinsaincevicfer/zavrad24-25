package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.DnevnikradaDTO;
import hr.unizg.fer.backend.backend.service.DnevnikradaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dnevnicirada")
public class DnevnikradaController {
    private final DnevnikradaService dnevnikradaService;

    public DnevnikradaController(DnevnikradaService dnevnikradaService) {
        this.dnevnikradaService = dnevnikradaService;
    }

    @GetMapping("/ugovor/{ugovorId}")
    public ResponseEntity<List<DnevnikradaDTO>> getAllByUgovor(@PathVariable Integer ugovorId) {
        return ResponseEntity.ok(dnevnikradaService.findAllByUgovorId(ugovorId));
    }

    @PostMapping("/stvori")
    public ResponseEntity<DnevnikradaDTO> create(@RequestBody DnevnikradaDTO dto) {
        return ResponseEntity.ok(dnevnikradaService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        dnevnikradaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DnevnikradaDTO> update(@PathVariable Integer id, @RequestBody DnevnikradaDTO dto) {
        return ResponseEntity.ok(dnevnikradaService.update(id, dto));
    }
}