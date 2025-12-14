package com.example.Aluguel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Aluguel.dto.ContratoAluguelDTO;
import com.example.Aluguel.dto.PedidoAluguelDTO;
import com.example.Aluguel.service.PedidoAluguelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class PedidoAluguelController {

    private final PedidoAluguelService pedidoService;

    @PostMapping("/criar")
    public ResponseEntity<PedidoAluguelDTO> criarPedido(@RequestBody PedidoAluguelDTO pedidoDTO) {
        PedidoAluguelDTO createdPedido = pedidoService.criarPedido(pedidoDTO);
        return ResponseEntity.ok(createdPedido);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoAluguelDTO> consultarPedido(@PathVariable Long id) {
        PedidoAluguelDTO pedido = pedidoService.consultarPedido(id);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoAluguelDTO>> consultarPedidosPorCliente(@PathVariable Long clienteId) {
        List<PedidoAluguelDTO> pedidos = pedidoService.consultarPedidosPorCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/modificar")
    public ResponseEntity<PedidoAluguelDTO> modificarPedido(@PathVariable Long id, @RequestBody PedidoAluguelDTO pedidoDTO) {
        PedidoAluguelDTO updatedPedido = pedidoService.modificarPedido(id, pedidoDTO);
        return ResponseEntity.ok(updatedPedido);
    }

    @PutMapping("/{id}/atualizar-detalhes")
    public ResponseEntity<PedidoAluguelDTO> atualizarDetalhesPedido(@PathVariable Long id, @RequestBody PedidoAluguelDTO pedidoDTO) {
        PedidoAluguelDTO updatedPedido = pedidoService.atualizarDetalhesPedido(id, pedidoDTO);
        return ResponseEntity.ok(updatedPedido);
    }

    @PutMapping("/{id}/modificar-completo")
    public ResponseEntity<PedidoAluguelDTO> modificarPedidoCompleto(
            @PathVariable Long id, 
            @RequestBody PedidoAluguelDTO pedidoDTO,
            @RequestParam(required = false) Long gestorId) {
        PedidoAluguelDTO updatedPedido = pedidoService.modificarPedidoCompleto(id, pedidoDTO, gestorId);
        return ResponseEntity.ok(updatedPedido);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id) {
        pedidoService.cancelarPedido(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/avaliar")
    public ResponseEntity<PedidoAluguelDTO> avaliarPedido(
            @PathVariable Long id,
            @RequestParam Long agenteId,
            @RequestParam boolean aprovado,
            @RequestParam(required = false) String observacoes) {
        PedidoAluguelDTO pedido = pedidoService.avaliarPedido(id, agenteId, aprovado, observacoes);
        return ResponseEntity.ok(pedido);
    }

    @PostMapping("/{id}/executar-contrato")
    public ResponseEntity<Object> executarContrato(
            @PathVariable Long id,
            @RequestParam Long agenteId,
            @RequestParam java.math.BigDecimal valorMensal,
            @RequestParam Integer prazoMeses) {
        Object contrato = pedidoService.executarContrato(id, agenteId, valorMensal, prazoMeses);
        return ResponseEntity.ok(contrato);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PedidoAluguelDTO>> listarPedidosPorStatus(@PathVariable String status) {
        List<PedidoAluguelDTO> pedidos = pedidoService.listarPedidosPorStatus(status);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/agente/{agenteId}/gerenciaveis")
    public ResponseEntity<List<PedidoAluguelDTO>> listarPedidosGerenciaveisPorAgente(@PathVariable Long agenteId) {
        List<PedidoAluguelDTO> pedidos = pedidoService.listarPedidosGerenciaveisPorAgente(agenteId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/agente/{agenteId}")
    public ResponseEntity<List<PedidoAluguelDTO>> listarPedidosPorAgente(@PathVariable Long agenteId) {
        List<PedidoAluguelDTO> pedidos = pedidoService.listarPedidosPorAgente(agenteId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<PedidoAluguelDTO>> listarTodosPedidos() {
        List<PedidoAluguelDTO> pedidos = pedidoService.listarTodosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/debug/agente/{agenteId}")
    public ResponseEntity<Object> debugPedidosAgente(@PathVariable Long agenteId) {
        try {
            List<PedidoAluguelDTO> pedidosGerenciaveis = pedidoService.listarPedidosGerenciaveisPorAgente(agenteId);
            List<PedidoAluguelDTO> todosPedidos = pedidoService.listarTodosPedidos();
            
            return ResponseEntity.ok(java.util.Map.of(
                "agenteId", agenteId,
                "pedidosGerenciaveis", pedidosGerenciaveis,
                "totalPedidos", todosPedidos.size(),
                "todosPedidos", todosPedidos
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "erro", e.getMessage(),
                "agenteId", agenteId
            ));
        }
    }

    @GetMapping("/debug/banco/{bancoId}")
    public ResponseEntity<Object> debugPedidosPorBanco(@PathVariable String bancoId) {
        try {
            List<PedidoAluguelDTO> pedidos = pedidoService.listarTodosPedidos();
            List<PedidoAluguelDTO> pedidosComCredito = pedidos.stream()
                .filter(p -> p.getPossuiContratoCredito() != null && p.getPossuiContratoCredito())
                .collect(java.util.stream.Collectors.toList());
            
            List<PedidoAluguelDTO> pedidosDoBanco = pedidos.stream()
                .filter(p -> bancoId.equals(p.getBancoContrato()))
                .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(java.util.Map.of(
                "bancoId", bancoId,
                "totalPedidos", pedidos.size(),
                "pedidosComCredito", pedidosComCredito,
                "pedidosDoBanco", pedidosDoBanco
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of(
                "erro", e.getMessage(),
                "bancoId", bancoId
            ));
        }
    }

    @GetMapping("/{pedidoId}/contrato")
    public ResponseEntity<Object> buscarContratoPorPedido(@PathVariable Long pedidoId) {
        try {
            ContratoAluguelDTO contrato = pedidoService.buscarContratoPorPedido(pedidoId);
            return ResponseEntity.ok(contrato);
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("erro", e.getMessage()));
        }
    }
}
