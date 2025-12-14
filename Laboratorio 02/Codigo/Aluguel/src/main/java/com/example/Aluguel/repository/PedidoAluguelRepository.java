package com.example.Aluguel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.Aluguel.entities.PedidoAluguel;

@Repository
public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteId(Long clienteId);
    List<PedidoAluguel> findByStatus(PedidoAluguel.StatusPedido status);
    List<PedidoAluguel> findByAgenteId(Long agenteId);
    
    // Pedidos com contrato de crédito para um banco específico (incluindo pendentes)
    @Query("SELECT p FROM PedidoAluguel p WHERE p.possuiContratoCredito = true AND p.bancoContrato = :bancoId")
    List<PedidoAluguel> findByPossuiContratoCreditoTrueAndBancoContrato(@Param("bancoId") String bancoId);
    
    // Pedidos sem contrato de crédito (para agentes normais)
    @Query("SELECT p FROM PedidoAluguel p WHERE p.possuiContratoCredito = false OR p.possuiContratoCredito IS NULL")
    List<PedidoAluguel> findBySemContratoCredito();
    
    // Pedidos gerenciáveis por um agente específico baseado no tipo
    @Query("SELECT p FROM PedidoAluguel p JOIN p.agente a WHERE " +
           "(a.tipoAgente = 'BANCO' AND p.possuiContratoCredito = true AND p.bancoContrato = a.nome AND a.id = :agenteId) OR " +
           "(a.tipoAgente IN ('LOCADORA', 'EMPRESA_FINANCEIRA') AND (p.possuiContratoCredito = false OR p.possuiContratoCredito IS NULL) AND a.id = :agenteId)")
    List<PedidoAluguel> findPedidosGerenciaveisPorAgente(@Param("agenteId") Long agenteId);
}