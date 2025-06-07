package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.OsobaDTO;
import hr.unizg.fer.backend.backend.dto.TvrtkaDTO;
import hr.unizg.fer.backend.backend.security.JwtService;
import hr.unizg.fer.backend.backend.security.LoginRequest;
import hr.unizg.fer.backend.backend.security.LoginResponse;
import hr.unizg.fer.backend.backend.service.KorisnikService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;

    private final KorisnikService korisnikService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, KorisnikService korisnikService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.korisnikService = korisnikService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
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
    public ResponseEntity<?> registerOsoba(@Valid @RequestBody OsobaDTO osobaDTO) {
        korisnikService.registerOsoba(osobaDTO);
        return ResponseEntity.ok("Osoba registrirana uspješno!");
    }

    @PostMapping("/register/tvrtka")
    public ResponseEntity<?> registerTvrtka(@Valid @RequestBody TvrtkaDTO tvrtkaDTO) {
        korisnikService.registerTvrtka(tvrtkaDTO);
        return ResponseEntity.ok("Tvrtka registrirana uspješno!");
    }
}