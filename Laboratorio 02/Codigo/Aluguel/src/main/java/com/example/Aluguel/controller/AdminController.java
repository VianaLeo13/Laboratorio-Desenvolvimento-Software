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

import com.example.Aluguel.dto.AdminDTO;
import com.example.Aluguel.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/cadastrar")
    public ResponseEntity<AdminDTO> criar(@RequestBody AdminDTO dto) {
        return ResponseEntity.ok(adminService.criar(dto));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<AdminDTO>> listar() {
        return ResponseEntity.ok(adminService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> obter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.obter(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> atualizar(@PathVariable Long id, @RequestBody AdminDTO dto) {
        return ResponseEntity.ok(adminService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        adminService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}


