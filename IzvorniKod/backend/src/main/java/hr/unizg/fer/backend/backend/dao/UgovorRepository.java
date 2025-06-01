package hr.unizg.fer.backend.backend.dao;

import hr.unizg.fer.backend.backend.domain.Ugovor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UgovorRepository extends JpaRepository<Ugovor, Integer> {
    List<Ugovor> findByPrijava_Projekt_Korisnik_Id(Integer korisnikId);

    List<Ugovor> findByPrijava_Korisnik_Id(Integer honoraracId);

}
