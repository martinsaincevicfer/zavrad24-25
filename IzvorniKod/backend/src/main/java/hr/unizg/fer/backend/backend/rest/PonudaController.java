package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.PonudaDTO;
import hr.unizg.fer.backend.backend.service.PonudaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ponude")
public class PonudaController {
    private final PonudaService ponudaService;

    public PonudaController(PonudaService ponudaService) {
        this.ponudaService = ponudaService;
    }

    @GetMapping("/klijent/sve")
    public List<PonudaDTO> getAllPonudeStvoreneOdUlogiranogKorisnika() {
        return ponudaService.getPonudeStvoreneOdUlogiranogKorisnika();
    }

    @GetMapping("/honorarac/sve")
    public List<PonudaDTO> getAllPonudeZaUlogiranogHonorarca() {
        return ponudaService.getPonudeZaUlogiranogHonorarca();
    }

    @PostMapping("/stvori")
    public PonudaDTO createPonuda(@RequestBody PonudaDTO ponudaDTO) {
        return ponudaService.createPonuda(ponudaDTO);
    }
}