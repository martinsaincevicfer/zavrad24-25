package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.KorisnikRepository;
import hr.unizg.fer.backend.backend.dao.UlogaRepository;
import hr.unizg.fer.backend.backend.domain.Korisnik;
import hr.unizg.fer.backend.backend.domain.Osoba;
import hr.unizg.fer.backend.backend.domain.Tvrtka;
import hr.unizg.fer.backend.backend.domain.Uloga;
import hr.unizg.fer.backend.backend.dto.OsobaDTO;
import hr.unizg.fer.backend.backend.dto.TvrtkaDTO;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@Transactional
public class KorisnikService {

    private final KorisnikRepository korisnikRepository;

    private final UlogaRepository ulogaRepository;

    private final PasswordEncoder passwordEncoder;

    public KorisnikService(KorisnikRepository korisnikRepository, UlogaRepository ulogaRepository, PasswordEncoder passwordEncoder) {
        this.korisnikRepository = korisnikRepository;
        this.ulogaRepository = ulogaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Korisnik findKorisnikById(Integer id) {
        return korisnikRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));
    }

    public Object getKorisnikDetails(String email) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));

        if (korisnik.getTvrtka() != null) {
            TvrtkaDTO tvrtkaDTO = new TvrtkaDTO();
            tvrtkaDTO.setId(korisnik.getId());
            tvrtkaDTO.setEmail(korisnik.getEmail());
            tvrtkaDTO.setTip("tvrtka");
            tvrtkaDTO.setOib(korisnik.getTvrtka().getOib());
            tvrtkaDTO.setNazivTvrtke(korisnik.getTvrtka().getNazivTvrtke());
            tvrtkaDTO.setAdresa(korisnik.getTvrtka().getAdresa());
            return tvrtkaDTO;
        } else if (korisnik.getOsoba() != null) {
            OsobaDTO osobaDTO = new OsobaDTO();
            osobaDTO.setId(korisnik.getId());
            osobaDTO.setEmail(korisnik.getEmail());
            osobaDTO.setTip("osoba");
            osobaDTO.setIme(korisnik.getOsoba().getIme());
            osobaDTO.setPrezime(korisnik.getOsoba().getPrezime());
            osobaDTO.setAdresa(korisnik.getOsoba().getAdresa());
            return osobaDTO;
        }

        return null;
    }

    public void registerOsoba(OsobaDTO osobaDTO) {
        if (korisnikRepository.findByEmail(osobaDTO.getEmail()).isPresent()) {
            throw new EntityExistsException("E-mail je već registriran");
        }

        Korisnik korisnik = new Korisnik();
        korisnik.setEmail(osobaDTO.getEmail());
        korisnik.setLozinka(passwordEncoder.encode(osobaDTO.getLozinka()));
        korisnik.setDatumStvaranja(Instant.now());

        Osoba osoba = new Osoba();
        osoba.setKorisnik(korisnik);
        osoba.setIme(osobaDTO.getIme());
        osoba.setPrezime(osobaDTO.getPrezime());
        osoba.setAdresa(osobaDTO.getAdresa());

        korisnik.setOsoba(osoba);

        Uloga naruciteljUloga = ulogaRepository.findById(2)
                .orElseThrow(() -> new EntityNotFoundException("Uloga 'narucitelj' nije pronađena"));
        korisnik.getUloge().add(naruciteljUloga);

        korisnikRepository.save(korisnik);
    }

    public void registerTvrtka(TvrtkaDTO tvrtkaDTO) {
        if (korisnikRepository.findByEmail(tvrtkaDTO.getEmail()).isPresent()) {
            throw new EntityExistsException("E-mail je već registriran");
        }

        Korisnik korisnik = new Korisnik();
        korisnik.setEmail(tvrtkaDTO.getEmail());
        korisnik.setLozinka(passwordEncoder.encode(tvrtkaDTO.getLozinka()));
        korisnik.setDatumStvaranja(Instant.now());

        Tvrtka tvrtka = new Tvrtka();
        tvrtka.setKorisnik(korisnik);
        tvrtka.setOib(tvrtkaDTO.getOib());
        tvrtka.setNazivTvrtke(tvrtkaDTO.getNazivTvrtke());
        tvrtka.setAdresa(tvrtkaDTO.getAdresa());

        korisnik.setTvrtka(tvrtka);

        Uloga naruciteljUloga = ulogaRepository.findById(2)
                .orElseThrow(() -> new EntityNotFoundException("Uloga 'narucitelj' nije pronađena"));
        korisnik.getUloge().add(naruciteljUloga);

        korisnikRepository.save(korisnik);
    }

    public void updateOsoba(String email, OsobaDTO osobaDTO) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));
        if (korisnik.getOsoba() == null) throw new EntityNotFoundException("Nije osoba");
        korisnik.getOsoba().setIme(osobaDTO.getIme());
        korisnik.getOsoba().setPrezime(osobaDTO.getPrezime());
        korisnik.getOsoba().setAdresa(osobaDTO.getAdresa());
        korisnikRepository.save(korisnik);
    }

    public void updateTvrtka(String email, TvrtkaDTO tvrtkaDTO) {
        Korisnik korisnik = korisnikRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));
        if (korisnik.getTvrtka() == null) throw new EntityNotFoundException("Nije tvrtka");
        korisnik.getTvrtka().setNazivTvrtke(tvrtkaDTO.getNazivTvrtke());
        korisnik.getTvrtka().setOib(tvrtkaDTO.getOib());
        korisnik.getTvrtka().setAdresa(tvrtkaDTO.getAdresa());
        korisnikRepository.save(korisnik);
    }
}