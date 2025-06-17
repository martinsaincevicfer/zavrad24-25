package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.UgovorDTO;
import hr.unizg.fer.backend.backend.dto.UgovorRequestDTO;
import hr.unizg.fer.backend.backend.service.UgovorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ugovori")
public class UgovorController {
    private final UgovorService ugovorService;

    public UgovorController(UgovorService ugovorService) {
        this.ugovorService = ugovorService;
    }

    @GetMapping("/{ugovorId}")
    public UgovorDTO getUgovorById(@PathVariable Integer ugovorId) {
        return ugovorService.getUgovorById(ugovorId);
    }

    @GetMapping
    public List<UgovorDTO> getAllUgovoriForCurrentUser(Principal principal) {
        String korisnikEmail = principal.getName();
        return ugovorService.findAllForCurrentUser(korisnikEmail);
    }

    @PostMapping("/korisnik/stvori")
    public UgovorDTO korisnikPrihvatiPrijavu(
            @Valid @RequestBody UgovorRequestDTO ugovorRequestDTO) {
        return ugovorService.createUgovorForKorisnik(
                ugovorRequestDTO.getPonudaId(),
                ugovorRequestDTO.getDatumPocetka()
        );
    }

    @PatchMapping("/narucitelj/zavrsi/{ugovorId}")
    public UgovorDTO naruciteljZavrsiUgovor(@PathVariable Integer ugovorId) {
        return ugovorService.markUgovorAsFinished(ugovorId);
    }
}
