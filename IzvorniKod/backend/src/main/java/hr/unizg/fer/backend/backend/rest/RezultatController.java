package hr.unizg.fer.backend.backend.rest;

import hr.unizg.fer.backend.backend.dto.RezultatDTO;
import hr.unizg.fer.backend.backend.dto.RezultatFormDTO;
import hr.unizg.fer.backend.backend.service.RezultatService;
import hr.unizg.fer.backend.backend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.util.List;

@RestController
@RequestMapping("/api/rezultati")
public class RezultatController {
    @Autowired
    private final RezultatService rezultatService;
    @Autowired
    private final S3Service s3Service;

    public RezultatController(RezultatService rezultatService, S3Service s3Service) {
        this.rezultatService = rezultatService;
        this.s3Service = s3Service;
    }

    @GetMapping("/by-ugovor")
    public List<RezultatDTO> getRezultatiByUgovor(@RequestParam("ugovorId") Integer ugovorId) {
        return rezultatService.getRezultatiByUgovorId(ugovorId);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadRezultat(@PathVariable Integer id) throws Exception {
        RezultatDTO rezultat = rezultatService.getRezultatById(id);
        String fileUrl = rezultat.getDatotekaUrl();
        String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

        String originalFilename = key.contains("_") ? key.substring(key.indexOf("_") + 1) : key;
        System.out.println("Download filename: " + originalFilename);

        ResponseInputStream<GetObjectResponse> s3Object = s3Service.getFileAsStream(key);
        byte[] fileBytes = s3Object.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", originalFilename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileBytes);
    }

    @PostMapping("/upload")
    public RezultatDTO uploadRezultat(RezultatFormDTO dto) throws Exception {
        return rezultatService.createRezultat(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRezultat(@PathVariable Integer id) {
        rezultatService.deleteRezultat(id);
        return ResponseEntity.noContent().build();
    }
}