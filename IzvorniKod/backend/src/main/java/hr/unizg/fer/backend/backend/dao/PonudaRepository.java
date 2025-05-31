package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Ponuda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PonudaRepository extends JpaRepository<Ponuda, Integer> {
    List<Ponuda> findAllByHonorarac_Id(Integer honoraracId);

    List<Ponuda> findAllByKlijent_Id(Integer klijentId);
}
