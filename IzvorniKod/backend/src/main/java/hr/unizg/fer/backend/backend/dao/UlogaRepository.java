package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Uloga;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UlogaRepository extends JpaRepository<Uloga, Integer> {
}
