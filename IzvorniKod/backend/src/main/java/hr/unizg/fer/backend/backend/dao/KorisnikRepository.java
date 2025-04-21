package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {
}
