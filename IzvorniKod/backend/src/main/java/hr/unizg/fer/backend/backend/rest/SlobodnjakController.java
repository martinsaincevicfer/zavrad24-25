package hr.unizg.fer.backend.backend.rest;

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
    public ResponseEntity<List<SlobodnjakDTO>> getAll() {
        List<SlobodnjakDTO> slobodnjaci = slobodnjakService.getAll();
        return ResponseEntity.ok(slobodnjaci);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SlobodnjakDTO> getById(@PathVariable Integer id) {
        try {
            SlobodnjakDTO slobodnjak = slobodnjakService.getById(id);
            return ResponseEntity.ok(slobodnjak);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}