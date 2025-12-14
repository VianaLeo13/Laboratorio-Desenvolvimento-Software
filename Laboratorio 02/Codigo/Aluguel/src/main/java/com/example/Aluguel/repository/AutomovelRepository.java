package com.example.Aluguel.repository;

import com.example.Aluguel.entities.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {
    Optional<Automovel> findByPlaca(String placa);
    boolean existsByPlaca(String placa);
}