package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Osoba;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OsobaRepository extends JpaRepository<Osoba, Integer> {
}
