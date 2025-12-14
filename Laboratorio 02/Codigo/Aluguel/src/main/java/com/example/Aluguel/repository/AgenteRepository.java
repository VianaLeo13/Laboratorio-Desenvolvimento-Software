package com.example.Aluguel.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Aluguel.entities.Agente;

@Repository
public interface AgenteRepository extends JpaRepository<Agente, Long> {
    Optional<Agente> findByCnpj(String cnpj);
    boolean existsByCnpj(String cnpj);
    List<Agente> findByTipoAgente(Agente.TipoAgente tipoAgente);
    List<Agente> findByAtivoTrue();
    Optional<Agente> findByEmail(String email);
    boolean existsByEmail(String email);
}

