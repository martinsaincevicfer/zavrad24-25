package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.UgovorDTO;
import hr.unizg.fer.backend.backend.dto.UgovorDetaljiDTO;
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
    public UgovorDetaljiDTO getUgovorById(@PathVariable Integer ugovorId) {
        return ugovorService.getUgovorById(ugovorId);
    }

    @GetMapping("/korisnik")
    public List<UgovorDTO> getUgovoriForKorisnik(Principal principal) {
        String korisnikEmail = principal.getName();
        return ugovorService.findAllByKorisnikEmail(korisnikEmail);
    }

    @GetMapping("/ponuditelj")
    public List<UgovorDTO> getUgovoriForPonuditelj(Principal principal) {
        String ponuditeljEmail = principal.getName();
        return ugovorService.findAllByPonuditeljEmail(ponuditeljEmail);
    }

    @PostMapping("/korisnik/stvori")
    public UgovorDTO korisnikPrihvatiPrijavu(
            @Valid @RequestBody UgovorRequestDTO ugovorRequestDTO) {
        return ugovorService.createUgovorForKorisnik(
                ugovorRequestDTO.getPonudaId(),
                ugovorRequestDTO.getDatumPocetka()
        );
    }

    @PatchMapping("/ponuditelj/zavrsi/{ugovorId}")
    public UgovorDTO ponuditeljZavrsiUgovor(@PathVariable Integer ugovorId) {
        return ugovorService.markUgovorAsFinished(ugovorId);
    }
}
