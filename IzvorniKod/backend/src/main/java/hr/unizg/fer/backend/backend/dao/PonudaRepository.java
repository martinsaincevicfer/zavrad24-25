package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Ponuda;
import hr.unizg.fer.backend.backend.domain.Ponuditelj;
import hr.unizg.fer.backend.backend.domain.Projekt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PonudaRepository extends JpaRepository<Ponuda, Integer> {
    List<Ponuda> findByPonuditelj(Ponuditelj korisnik);

    List<Ponuda> findByProjekt(Projekt projekt);
}
