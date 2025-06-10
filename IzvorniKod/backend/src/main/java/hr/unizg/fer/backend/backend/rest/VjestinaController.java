package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.VjestinaDTO;
import hr.unizg.fer.backend.backend.service.VjestinaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}