package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Projekt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjektRepository extends JpaRepository<Projekt, Integer> {
}