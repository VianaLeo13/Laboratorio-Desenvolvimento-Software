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

import com.example.Aluguel.dto.AutomovelDTO;
import com.example.Aluguel.service.AutomovelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/automoveis")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class AutomovelController {

    private final AutomovelService automovelService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AutomovelDTO> criarAutomovel(@RequestBody AutomovelDTO automovelDTO) {
        AutomovelDTO createdAutomovel = automovelService.criarAutomovel(automovelDTO);
        return ResponseEntity.ok(createdAutomovel);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AutomovelDTO>> listarAutomoveis() {
        List<AutomovelDTO> automoveis = automovelService.listarAutomoveis();
        return ResponseEntity.ok(automoveis);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomovelDTO> buscarAutomovel(@PathVariable Long id) {
        AutomovelDTO automovel = automovelService.buscarPorId(id);
        return ResponseEntity.ok(automovel);
    }

    @PutMapping("/{id}/atualizar")
    public ResponseEntity<AutomovelDTO> atualizarAutomovel(@PathVariable Long id, @RequestBody AutomovelDTO automovelDTO) {
        AutomovelDTO updatedAutomovel = automovelService.atualizarAutomovel(id, automovelDTO);
        return ResponseEntity.ok(updatedAutomovel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAutomovel(@PathVariable Long id) {
        automovelService.deletarAutomovel(id);
        return ResponseEntity.noContent().build();
    }
}
