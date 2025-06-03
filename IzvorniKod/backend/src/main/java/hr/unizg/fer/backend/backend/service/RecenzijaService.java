package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.RecenzijaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Recenzija;
import hr.unizg.fer.backend.backend.domain.Ugovor;
import hr.unizg.fer.backend.backend.dto.RecenzijaDTO;
import hr.unizg.fer.backend.backend.dto.RecenzijaFormDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RecenzijaService {
    @Autowired
    private final RecenzijaRepository recenzijaRepository;
    @Autowired
    private UgovorRepository ugovorRepository;
    @Autowired
    private KorisnikRepository korisnikRepository;

    public RecenzijaService(RecenzijaRepository recenzijaRepository) {
        this.recenzijaRepository = recenzijaRepository;
    }

    @Transactional
    public void createRecenzija(RecenzijaFormDTO recenzijaFormDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik not found"));

        Ugovor ugovor = ugovorRepository.findById(recenzijaFormDTO.getUgovorId()).get();
        if (!ugovor.getPrijava().getProjekt().getKorisnik().equals(korisnik)) {
            throw new IllegalArgumentException("Ulogirani korisnik nije vlasnik projekta!");
        }

        Recenzija recenzija = new Recenzija();
        recenzija.setOcjena(recenzijaFormDTO.getOcjena());
        recenzija.setKomentar(recenzijaFormDTO.getKomentar());
        recenzija.setDatumStvaranja(Instant.now());
        recenzija.setUgovor(ugovor);

        ugovor.setRecenzija(recenzija);

        recenzijaRepository.save(recenzija);
    }

    @Transactional
    public List<RecenzijaDTO> getRecenzijeForHonorarac(Integer honoraracId) {
        List<Ugovor> ugovori = ugovorRepository.findByPrijava_Korisnik_Id(honoraracId);
        return ugovori.stream()
                .map(Ugovor::getRecenzija)
                .filter(Objects::nonNull)
                .map(recenzija -> new RecenzijaDTO(
                        recenzija.getOcjena(),
                        recenzija.getKomentar(),
                        recenzija.getDatumStvaranja()
                ))
                .collect(Collectors.toList());
    }
}
