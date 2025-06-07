package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Ponuditelj;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PonuditeljRepository extends JpaRepository<Ponuditelj, Integer> {
}
