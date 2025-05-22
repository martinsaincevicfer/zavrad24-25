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
        SlobodnjakDTO slobodnjak = slobodnjakService.getById(id);
        return ResponseEntity.ok(slobodnjak);
    }

    @GetMapping("/current")
    public ResponseEntity<SlobodnjakDTO> getCurrentSlobodnjak() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        SlobodnjakDTO slobodnjakDTO = slobodnjakService.getByEmail(currentUserEmail);
        return ResponseEntity.ok(slobodnjakDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<SlobodnjakDTO> createSlobodnjakForCurrentUser(@RequestBody SlobodnjakDTO slobodnjakDTO) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        SlobodnjakDTO kreiraniSlobodnjak = slobodnjakService.createSlobodnjak(currentUserEmail, slobodnjakDTO);
        return ResponseEntity.ok(kreiraniSlobodnjak);
    }
}