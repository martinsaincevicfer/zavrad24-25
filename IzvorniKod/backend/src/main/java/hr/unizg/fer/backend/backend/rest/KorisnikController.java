package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.OsobaDTO;
import hr.unizg.fer.backend.backend.dto.TvrtkaDTO;
import hr.unizg.fer.backend.backend.service.KorisnikService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {
    private final KorisnikService korisnikService;

    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @GetMapping("/profil")
    public ResponseEntity<?> getKorisnikProfil(Authentication authentication) {
        String email = authentication.getName();
        Object korisnikDetails = korisnikService.getKorisnikDetails(email);

        if (korisnikDetails == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(korisnikDetails);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getKorisnikById(@PathVariable Integer id) {
        var korisnik = korisnikService.findKorisnikById(id);

        if (korisnik.getOsoba() != null) {
            OsobaDTO osobaDTO = new OsobaDTO();
            osobaDTO.setId(korisnik.getId());
            osobaDTO.setEmail(korisnik.getEmail());
            osobaDTO.setTip("OSOBA");
            osobaDTO.setIme(korisnik.getOsoba().getIme());
            osobaDTO.setPrezime(korisnik.getOsoba().getPrezime());
            osobaDTO.setAdresa(korisnik.getOsoba().getAdresa());
            return ResponseEntity.ok(osobaDTO);
        } else if (korisnik.getTvrtka() != null) {
            TvrtkaDTO tvrtkaDTO = new TvrtkaDTO();
            tvrtkaDTO.setId(korisnik.getId());
            tvrtkaDTO.setEmail(korisnik.getEmail());
            tvrtkaDTO.setTip("TVRTKA");
            tvrtkaDTO.setOib(korisnik.getTvrtka().getOib());
            tvrtkaDTO.setNazivTvrtke(korisnik.getTvrtka().getNazivTvrtke());
            tvrtkaDTO.setAdresa(korisnik.getTvrtka().getAdresa());
            return ResponseEntity.ok(tvrtkaDTO);
        } else {
            return ResponseEntity.badRequest().body("Nepoznata vrsta korisnika.");
        }
    }

}