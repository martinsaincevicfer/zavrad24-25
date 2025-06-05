package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Rezultat;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RezultatRepository extends CrudRepository<Rezultat, Integer> {
    List<Rezultat> findByUgovorId(Integer ugovorId);
}
