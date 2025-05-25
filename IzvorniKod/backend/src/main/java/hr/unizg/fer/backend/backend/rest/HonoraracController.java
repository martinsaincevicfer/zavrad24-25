package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.HonoraracDTO;
import hr.unizg.fer.backend.backend.service.HonoraracService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/honorarci")
public class HonoraracController {
    @Autowired
    private final HonoraracService honoraracService;

    public HonoraracController(HonoraracService honoraracService) {
        this.honoraracService = honoraracService;
    }

    @GetMapping
    public ResponseEntity<List<HonoraracDTO>> getAll() {
        List<HonoraracDTO> slobodnjaci = honoraracService.getAll();
        return ResponseEntity.ok(slobodnjaci);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HonoraracDTO> getById(@PathVariable Integer id) {
        HonoraracDTO honoraracDTO = honoraracService.getById(id);
        return ResponseEntity.ok(honoraracDTO);
    }

    @GetMapping("/current")
    public ResponseEntity<HonoraracDTO> getCurrentHonorarac() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        HonoraracDTO honoraracDTO = honoraracService.getByEmail(currentUserEmail);
        return ResponseEntity.ok(honoraracDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<HonoraracDTO> createHonoraracForCurrentUser(@Valid @RequestBody HonoraracDTO honoraracDTO) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        HonoraracDTO kreiraniHonorarac = honoraracService.createHonorarac(currentUserEmail, honoraracDTO);
        return ResponseEntity.ok(kreiraniHonorarac);
    }
}