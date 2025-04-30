package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Vjestina;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VjestinaRepository extends JpaRepository<Vjestina, Integer> {
}
