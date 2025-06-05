package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.RezultatRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.Rezultat;
import hr.unizg.fer.backend.backend.domain.Ugovor;
import hr.unizg.fer.backend.backend.dto.RezultatDTO;
import hr.unizg.fer.backend.backend.dto.RezultatFormDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class RezultatService {
    @Autowired
    private final RezultatRepository rezultatRepository;
    @Autowired
    private final S3Service s3Service;
    @Autowired
    private final UgovorRepository ugovorRepository;

    public RezultatService(RezultatRepository rezultatRepository, S3Service s3Service, UgovorRepository ugovorRepository) {
        this.rezultatRepository = rezultatRepository;
        this.s3Service = s3Service;
        this.ugovorRepository = ugovorRepository;
    }

    @Transactional
    public List<RezultatDTO> getRezultatiByUgovorId(Integer ugovorId) {
        return rezultatRepository.findByUgovorId(ugovorId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public RezultatDTO getRezultatById(Integer id) {
        Rezultat rezultat = rezultatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rezultat nije pronađen"));
        return toDto(rezultat);
    }

    @Transactional
    public RezultatDTO createRezultat(RezultatFormDTO rezultatFormDTO) throws Exception {
        String fileUrl = s3Service.uploadFile(rezultatFormDTO.getFile());

        Ugovor ugovor = ugovorRepository.findById(rezultatFormDTO.getUgovorId())
                .orElseThrow(() -> new EntityNotFoundException("Nije pronaden ugovor sa tim id."));

        Rezultat rezultat = new Rezultat();
        rezultat.setUgovor(ugovor);
        rezultat.setNaziv(rezultatFormDTO.getNaziv());
        rezultat.setDatotekaUrl(fileUrl);
        rezultat.setDatumUploada(Instant.now());

        ugovor.getRezultati().add(rezultat);

        return toDto(rezultatRepository.save(rezultat));
    }

    @Transactional
    public void deleteRezultat(Integer id) {
        Rezultat rezultat = rezultatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rezultat nije pronađen"));
        String fileUrl = rezultat.getDatotekaUrl();
        String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        s3Service.deleteFile(key);
        rezultatRepository.delete(rezultat);
    }

    public RezultatDTO toDto(Rezultat rezultat) {
        RezultatDTO dto = new RezultatDTO();
        dto.setId(rezultat.getId());
        dto.setNaziv(rezultat.getNaziv());
        dto.setDatotekaUrl(rezultat.getDatotekaUrl());
        return dto;
    }
}