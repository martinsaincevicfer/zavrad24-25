package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.UgovorDTO;
import hr.unizg.fer.backend.backend.dto.UgovorDetaljiDTO;
import hr.unizg.fer.backend.backend.dto.UgovorRequestDTO;
import hr.unizg.fer.backend.backend.service.UgovorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/ugovori")
public class UgovorController {
    @Autowired
    private final UgovorService ugovorService;

    public UgovorController(UgovorService ugovorService) {
        this.ugovorService = ugovorService;
    }

    @GetMapping("/{ugovorId}")
    public UgovorDetaljiDTO getUgovorById(@PathVariable Integer ugovorId) {
        return ugovorService.getUgovorById(ugovorId);
    }

    @GetMapping("/korisnik")
    public List<UgovorDTO> getUgovoriForKorisnik(Principal principal) {
        String korisnikEmail = principal.getName();
        return ugovorService.findAllByKorisnikEmail(korisnikEmail);
    }

    @GetMapping("/honorarac")
    public List<UgovorDTO> getUgovoriForHonorarac(Principal principal) {
        String honoraracEmail = principal.getName();
        return ugovorService.findAllByHonoraracEmail(honoraracEmail);
    }

    @PostMapping("/korisnik/stvori")
    public UgovorDTO korisnikPrihvatiPrijavu(
            @Valid @RequestBody UgovorRequestDTO ugovorRequestDTO) {
        return ugovorService.createUgovorForKorisnik(
                ugovorRequestDTO.getPrijavaId(),
                ugovorRequestDTO.getDatumPocetka()
        );
    }

    @PatchMapping("/honorarac/zavrsi/{ugovorId}")
    public UgovorDTO honoraracZavrsiUgovor(@PathVariable Integer ugovorId) {
        return ugovorService.markUgovorAsFinished(ugovorId);
    }
}
