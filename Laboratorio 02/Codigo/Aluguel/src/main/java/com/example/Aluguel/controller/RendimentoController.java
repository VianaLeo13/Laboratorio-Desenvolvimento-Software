package com.example.Aluguel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Aluguel.dto.RendimentoDTO;
import com.example.Aluguel.service.RendimentoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rendimentos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class RendimentoController {

    private final RendimentoService rendimentoService;

    @PostMapping("/criar")
    public ResponseEntity<RendimentoDTO> criarRendimento(@RequestBody RendimentoDTO rendimentoDTO) {
        RendimentoDTO createdRendimento = rendimentoService.criarRendimento(rendimentoDTO);
        return ResponseEntity.ok(createdRendimento);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<RendimentoDTO>> listarRendimentosPorCliente(@PathVariable Long clienteId) {
        List<RendimentoDTO> rendimentos = rendimentoService.listarRendimentosPorCliente(clienteId);
        return ResponseEntity.ok(rendimentos);
    }

    @GetMapping("/debug")
    public ResponseEntity<Object> debugRendimentos() {
        try {
            List<RendimentoDTO> todosRendimentos = rendimentoService.listarTodosRendimentos();
            return ResponseEntity.ok(java.util.Map.of(
                "total", todosRendimentos.size(),
                "rendimentos", todosRendimentos
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendimentoDTO> atualizarRendimento(@PathVariable Long id, @RequestBody RendimentoDTO rendimentoDTO) {
        RendimentoDTO updatedRendimento = rendimentoService.atualizarRendimento(id, rendimentoDTO);
        return ResponseEntity.ok(updatedRendimento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRendimento(@PathVariable Long id) {
        rendimentoService.deletarRendimento(id);
        return ResponseEntity.noContent().build();
    }
}
