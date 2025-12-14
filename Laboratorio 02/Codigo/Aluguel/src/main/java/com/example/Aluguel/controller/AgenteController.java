package com.example.Aluguel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Aluguel.dto.AgenteDTO;
import com.example.Aluguel.dto.LoginDTO;
import com.example.Aluguel.service.AgenteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agentes")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class AgenteController {

    private final AgenteService agenteService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AgenteDTO> criarAgente(@RequestBody AgenteDTO agenteDTO) {
        AgenteDTO createdAgente = agenteService.criarAgente(agenteDTO);
        return ResponseEntity.ok(createdAgente);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AgenteDTO>> listarAgentes() {
        List<AgenteDTO> agentes = agenteService.listarAgentes();
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<AgenteDTO>> listarAgentesAtivos() {
        List<AgenteDTO> agentes = agenteService.listarAgentesAtivos();
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<AgenteDTO>> listarAgentesPorTipo(@PathVariable String tipo) {
        List<AgenteDTO> agentes = agenteService.listarAgentesPorTipo(tipo);
        return ResponseEntity.ok(agentes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgenteDTO> buscarAgente(@PathVariable Long id) {
        AgenteDTO agente = agenteService.buscarPorId(id);
        return ResponseEntity.ok(agente);
    }

    @PostMapping("/login")
    public ResponseEntity<AgenteDTO> loginAgente(@RequestBody LoginDTO loginDTO) {
        AgenteDTO agente = agenteService.autenticarAgente(loginDTO.getEmail(), loginDTO.getPassword());
        return ResponseEntity.ok(agente);
    }

    @GetMapping("/debug/{id}")
    public ResponseEntity<Object> debugAgente(@PathVariable Long id) {
        try {
            AgenteDTO agente = agenteService.buscarPorId(id);
            return ResponseEntity.ok(java.util.Map.of(
                "agente", agente,
                "nome", agente.getNome(),
                "tipoAgente", agente.getTipoAgente(),
                "id", agente.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "erro", e.getMessage(),
                "agenteId", id
            ));
        }
    }
}
