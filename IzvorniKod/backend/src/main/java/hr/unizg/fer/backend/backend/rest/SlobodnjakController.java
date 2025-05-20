package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.SlobodnjakDTO;
import hr.unizg.fer.backend.backend.service.SlobodnjakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/current")
    public ResponseEntity<SlobodnjakDTO> getCurrentSlobodnjak() {
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            SlobodnjakDTO slobodnjakDTO = slobodnjakService.getByEmail(currentUserEmail);
            return ResponseEntity.ok(slobodnjakDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<SlobodnjakDTO> createSlobodnjakForCurrentUser(@RequestBody SlobodnjakDTO slobodnjakDTO) {
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

            SlobodnjakDTO createdSlobodnjak = slobodnjakService.createSlobodnjak(currentUserEmail, slobodnjakDTO);
            return ResponseEntity.ok(createdSlobodnjak);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}