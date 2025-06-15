package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.PonuditeljDTO;
import hr.unizg.fer.backend.backend.security.JwtService;
import hr.unizg.fer.backend.backend.security.KorisnikDetailsService;
import hr.unizg.fer.backend.backend.security.LoginResponse;
import hr.unizg.fer.backend.backend.service.PonuditeljService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ponuditelji")
public class PonuditeljController {
    private final PonuditeljService ponuditeljService;
    private final KorisnikDetailsService korisnikDetailsService;
    private final JwtService jwtService;

    public PonuditeljController(PonuditeljService ponuditeljService, KorisnikDetailsService korisnikDetailsService, JwtService jwtService) {
        this.ponuditeljService = ponuditeljService;
        this.korisnikDetailsService = korisnikDetailsService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<List<PonuditeljDTO>> getAll() {
        List<PonuditeljDTO> ponuditelji = ponuditeljService.getAll();
        return ResponseEntity.ok(ponuditelji);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PonuditeljDTO> getById(@PathVariable Integer id) {
        PonuditeljDTO ponuditeljDTO = ponuditeljService.getById(id);
        return ResponseEntity.ok(ponuditeljDTO);
    }

    @GetMapping("/current")
    public ResponseEntity<PonuditeljDTO> getCurrentPonuditelj() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        PonuditeljDTO ponuditeljDTO = ponuditeljService.getByEmail(currentUserEmail);
        return ResponseEntity.ok(ponuditeljDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> createPonuditeljForCurrentUser(@Valid @RequestBody PonuditeljDTO ponuditeljDTO) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        ponuditeljService.createPonuditelj(currentUserEmail, ponuditeljDTO);

        UserDetails userDetails = korisnikDetailsService.loadUserByUsername(currentUserEmail);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtService.generateToken(authentication);

        return ResponseEntity.ok(new LoginResponse(jwt, currentUserEmail));
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateCurrentPonuditelj(@Valid @RequestBody PonuditeljDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ponuditeljService.updatePonuditelj(email, dto);
        return ResponseEntity.ok("Ponuditelj ažuriran!");
    }
}