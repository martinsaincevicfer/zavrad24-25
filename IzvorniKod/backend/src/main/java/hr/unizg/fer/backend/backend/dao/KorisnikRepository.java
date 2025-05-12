package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {
    Optional<Korisnik> findByEmail(String email);
}
