package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.PonuditeljDTO;
import hr.unizg.fer.backend.backend.service.PonuditeljService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ponuditelji")
public class PonuditeljController {
    private final PonuditeljService ponuditeljService;

    public PonuditeljController(PonuditeljService ponuditeljService) {
        this.ponuditeljService = ponuditeljService;
    }

    @GetMapping
    public ResponseEntity<List<PonuditeljDTO>> getAll() {
        List<PonuditeljDTO> ponuditelji = ponuditeljService.getAll();
        return ResponseEntity.ok(ponuditelji);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PonuditeljDTO> getById(@PathVariable Integer id) {
        PonuditeljDTO ponuditeljDTO = ponuditeljService.getById(id);
        return ResponseEntity.ok(ponuditeljDTO);
    }

    @GetMapping("/current")
    public ResponseEntity<PonuditeljDTO> getCurrentPonuditelj() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        PonuditeljDTO ponuditeljDTO = ponuditeljService.getByEmail(currentUserEmail);
        return ResponseEntity.ok(ponuditeljDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<PonuditeljDTO> createPonuditeljForCurrentUser(@Valid @RequestBody PonuditeljDTO ponuditeljDTO) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        PonuditeljDTO kreiraniPonuditelj = ponuditeljService.createPonuditelj(currentUserEmail, ponuditeljDTO);
        return ResponseEntity.ok(kreiraniPonuditelj);
    }
}