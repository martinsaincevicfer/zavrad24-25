package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.domain.Slobodnjak;
import hr.unizg.fer.backend.backend.dto.SlobodnjakDTO;
import hr.unizg.fer.backend.backend.service.SlobodnjakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/slobodnjaci")
public class SlobodnjakController {
    @Autowired
    private final SlobodnjakService slobodnjakService;

    public SlobodnjakController(SlobodnjakService slobodnjakService) {
        this.slobodnjakService = slobodnjakService;
    }

    @GetMapping
    public ResponseEntity<List<SlobodnjakDTO>> getAllSlobodnjaci() {
        return ResponseEntity.ok(slobodnjakService.getAllSlobodnjaci());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SlobodnjakDTO> getSlobodnjak(@PathVariable Integer id) {
        try {
            SlobodnjakDTO slobodnjak = slobodnjakService.getSlobodnjakById(id);
            return ResponseEntity.ok(slobodnjak);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
