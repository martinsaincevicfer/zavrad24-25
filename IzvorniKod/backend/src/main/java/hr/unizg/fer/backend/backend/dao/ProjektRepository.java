package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Projekt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProjektRepository extends JpaRepository<Projekt, Integer>, JpaSpecificationExecutor<Projekt> {
}