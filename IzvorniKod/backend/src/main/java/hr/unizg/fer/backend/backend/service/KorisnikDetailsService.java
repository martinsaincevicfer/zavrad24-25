package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.stream.Collectors;

@Service
public class KorisnikDetailsService implements UserDetailsService {
    
    @Autowired
    private KorisnikRepository korisnikRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Korisnik korisnik = (Korisnik) korisnikRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen"));

        String testPassword = "lozinka123";
        String hashedPassword = new BCryptPasswordEncoder().encode(testPassword);
        System.out.println(hashedPassword);

        return new User(korisnik.getEmail(), 
                       korisnik.getLozinka(),
                       korisnik.getUloge().stream()
                           .map(uloga -> new SimpleGrantedAuthority(uloga.getNaziv()))
                           .collect(Collectors.toList()));
    }
}