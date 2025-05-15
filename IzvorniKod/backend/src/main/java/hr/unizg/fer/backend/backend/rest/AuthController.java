package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.OsobaDTO;
import hr.unizg.fer.backend.backend.dto.TvrtkaDTO;
import hr.unizg.fer.backend.backend.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hr.unizg.fer.backend.backend.security.JwtService;
import hr.unizg.fer.backend.backend.security.LoginRequest;
import hr.unizg.fer.backend.backend.security.LoginResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private KorisnikService korisnikService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getLozinka()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = jwtService.generateToken(authentication);
        
        return ResponseEntity.ok(new LoginResponse(jwt, loginRequest.getEmail()));
    }

    @PostMapping("/register/osoba")
    public ResponseEntity<?> registerOsoba(@RequestBody OsobaDTO osobaDTO) {
        korisnikService.registerOsoba(osobaDTO);
        return ResponseEntity.ok("Osoba registrirana uspješno!");
    }

    @PostMapping("/register/tvrtka")
    public ResponseEntity<?> registerTvrtka(@RequestBody TvrtkaDTO tvrtkaDTO) {
        korisnikService.registerTvrtka(tvrtkaDTO);
        return ResponseEntity.ok("Tvrtka registrirana uspješno!");
    }
}