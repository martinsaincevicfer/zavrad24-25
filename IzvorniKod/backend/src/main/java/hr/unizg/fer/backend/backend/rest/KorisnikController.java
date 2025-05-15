package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/korisnik")
public class KorisnikController {
    @Autowired
    private KorisnikService korisnikService;

    @GetMapping("/profil")
    public ResponseEntity<?> getKorisnikProfil(Authentication authentication) {
        String email = authentication.getName();
        Object korisnikDetails = korisnikService.getKorisnikDetails(email);
        
        if (korisnikDetails == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(korisnikDetails);
    }
}