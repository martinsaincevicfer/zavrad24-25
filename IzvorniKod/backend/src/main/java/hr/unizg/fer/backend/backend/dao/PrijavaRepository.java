package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Honorarac;
import hr.unizg.fer.backend.backend.domain.Prijava;
import hr.unizg.fer.backend.backend.domain.Projekt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrijavaRepository extends JpaRepository<Prijava, Integer> {
    List<Prijava> findByKorisnik(Honorarac korisnik);
    List<Prijava> findByProjekt(Projekt projekt);
}
