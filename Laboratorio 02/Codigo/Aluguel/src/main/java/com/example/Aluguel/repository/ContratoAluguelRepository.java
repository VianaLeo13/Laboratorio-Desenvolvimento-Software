package com.example.Aluguel.repository;

import com.example.Aluguel.entities.ContratoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoAluguelRepository extends JpaRepository<ContratoAluguel, Long> {
    Optional<ContratoAluguel> findByPedidoId(Long pedidoId);
    List<ContratoAluguel> findByAgenteId(Long agenteId);
    List<ContratoAluguel> findByStatus(ContratoAluguel.StatusContrato status);
    Optional<ContratoAluguel> findByNumeroContrato(String numeroContrato);
}

