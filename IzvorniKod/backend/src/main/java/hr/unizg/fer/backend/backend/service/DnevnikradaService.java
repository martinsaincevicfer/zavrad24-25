package hr.unizg.fer.backend.backend.service;

import hr.unizg.fer.backend.backend.dao.DnevnikradaRepository;
import hr.unizg.fer.backend.backend.dao.UgovorRepository;
import hr.unizg.fer.backend.backend.domain.Dnevnikrada;
import hr.unizg.fer.backend.backend.domain.Ugovor;
import hr.unizg.fer.backend.backend.dto.DnevnikradaDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DnevnikradaService {
    private final DnevnikradaRepository dnevnikradaRepository;
    private final UgovorRepository ugovorRepository;

    public DnevnikradaService(DnevnikradaRepository dnevnikradaRepository, UgovorRepository ugovorRepository) {
        this.dnevnikradaRepository = dnevnikradaRepository;
        this.ugovorRepository = ugovorRepository;
    }

    @Transactional
    public DnevnikradaDTO create(DnevnikradaDTO dto) {
        Ugovor ugovor = ugovorRepository.findById(dto.getUgovorId())
                .orElseThrow(() -> new IllegalArgumentException("Ugovor not found"));
        Dnevnikrada dnevnikrada = new Dnevnikrada();
        dnevnikrada.setUgovor(ugovor);
        dnevnikrada.setPoruka(dto.getPoruka());
        dnevnikrada.setDatumUnosa(Instant.now());
        dnevnikrada = dnevnikradaRepository.save(dnevnikrada);
        dto.setId(dnevnikrada.getId());
        dto.setDatumUnosa(dnevnikrada.getDatumUnosa());
        return dto;
    }

    @Transactional
    public void delete(Integer id) {
        dnevnikradaRepository.deleteById(id);
    }

    @Transactional
    public List<DnevnikradaDTO> findAllByUgovorId(Integer ugovorId) {
        return dnevnikradaRepository.findAll().stream()
                .filter(d -> d.getUgovor().getId().equals(ugovorId))
                .map(d -> {
                    DnevnikradaDTO dto = new DnevnikradaDTO();
                    dto.setId(d.getId());
                    dto.setUgovorId(ugovorId);
                    dto.setPoruka(d.getPoruka());
                    dto.setDatumUnosa(d.getDatumUnosa());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public DnevnikradaDTO update(Integer id, DnevnikradaDTO dto) {
        Dnevnikrada dnevnikrada = dnevnikradaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dnevnikrada not found"));
        dnevnikrada.setPoruka(dto.getPoruka());
        dnevnikrada = dnevnikradaRepository.save(dnevnikrada);
        dto.setId(dnevnikrada.getId());
        dto.setDatumUnosa(dnevnikrada.getDatumUnosa());
        return dto;
    }
}