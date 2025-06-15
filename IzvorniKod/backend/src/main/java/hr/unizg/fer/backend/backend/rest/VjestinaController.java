package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.VjestinaDTO;
import hr.unizg.fer.backend.backend.service.VjestinaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vjestine")
public class VjestinaController {
    private final VjestinaService vjestinaService;

    public VjestinaController(VjestinaService vjestinaService) {
        this.vjestinaService = vjestinaService;
    }

    @GetMapping
    public List<VjestinaDTO> searchVjestine(
            @RequestParam(required = false) String naziv) {
        return vjestinaService.searchVjestine(naziv);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('administrator')")
    public List<VjestinaDTO> getAllVjestine() {
        return vjestinaService.getAllVjestine();
    }

    @PostMapping
    @PreAuthorize("hasRole('administrator')")
    public VjestinaDTO createVjestina(@RequestBody VjestinaDTO dto) {
        return vjestinaService.createVjestina(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public VjestinaDTO updateVjestina(@PathVariable Integer id, @RequestBody VjestinaDTO dto) {
        return vjestinaService.updateVjestina(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('administrator')")
    public void deleteVjestina(@PathVariable Integer id) {
        vjestinaService.deleteVjestina(id);
    }
}