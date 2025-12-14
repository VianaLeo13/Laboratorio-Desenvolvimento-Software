package com.example.Aluguel.repository;

import com.example.Aluguel.entities.Rendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RendimentoRepository extends JpaRepository<Rendimento, Long> {
    List<Rendimento> findByClienteId(Long clienteId);
}