package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Ugovor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UgovorRepository extends JpaRepository<Ugovor, Integer> {
    List<Ugovor> findByPonuda_Projekt_Narucitelj_Id(Integer naruciteljId);

    List<Ugovor> findByPonuda_Ponuditelj_Id(Integer ponuditeljId);

}
