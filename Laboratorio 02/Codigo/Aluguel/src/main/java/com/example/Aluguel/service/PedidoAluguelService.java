package com.example.Aluguel.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Aluguel.dto.ContratoAluguelDTO;
import com.example.Aluguel.dto.PedidoAluguelDTO;
import com.example.Aluguel.entities.Agente;
import com.example.Aluguel.entities.Automovel;
import com.example.Aluguel.entities.Cliente;
import com.example.Aluguel.entities.ContratoAluguel;
import com.example.Aluguel.entities.PedidoAluguel;
import com.example.Aluguel.repository.AgenteRepository;
import com.example.Aluguel.repository.AutomovelRepository;
import com.example.Aluguel.repository.ClienteRepository;
import com.example.Aluguel.repository.ContratoAluguelRepository;
import com.example.Aluguel.repository.PedidoAluguelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoAluguelService {

    private final PedidoAluguelRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final AgenteRepository agenteRepository;
    private final ContratoAluguelRepository contratoRepository;

    public PedidoAluguelDTO criarPedido(PedidoAluguelDTO pedidoDTO) {
        // Validar se cliente existe
        Cliente cliente = clienteRepository.findById(pedidoDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Validar se automóvel existe
        Automovel automovel = automovelRepository.findById(pedidoDTO.getAutomovelId())
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));

        // Criar pedido
        PedidoAluguel pedido = PedidoAluguel.builder()
                .cliente(cliente)
                .automovel(automovel)
                .status(PedidoAluguel.StatusPedido.PENDENTE)
                .dataCriacao(pedidoDTO.getDataCriacao())
                .possuiContratoCredito(pedidoDTO.getPossuiContratoCredito())
                .bancoContrato(pedidoDTO.getBancoContrato())
                .build();

        PedidoAluguel savedPedido = pedidoRepository.save(pedido);
        return convertToDTO(savedPedido);
    }

    public PedidoAluguelDTO consultarPedido(Long id) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return convertToDTO(pedido);
    }

    public List<PedidoAluguelDTO> consultarPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PedidoAluguelDTO modificarPedido(Long id, PedidoAluguelDTO pedidoDTO) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Só permite modificação se o pedido não estiver em execução
        if (pedido.getStatus() == PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Não é possível modificar um pedido já contratado");
        }

        // Atualizar campos permitidos
        pedido.setDataModificacao(LocalDateTime.now());
        pedido.setStatus(PedidoAluguel.StatusPedido.valueOf(pedidoDTO.getStatus().toUpperCase()));

        PedidoAluguel updatedPedido = pedidoRepository.save(pedido);
        return convertToDTO(updatedPedido);
    }

    public PedidoAluguelDTO atualizarDetalhesPedido(Long id, PedidoAluguelDTO pedidoDTO) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Permite atualização de detalhes apenas se o pedido estiver pendente ou em análise
        if (pedido.getStatus() != PedidoAluguel.StatusPedido.PENDENTE && 
            pedido.getStatus() != PedidoAluguel.StatusPedido.ANALISE_FINANCEIRA) {
            throw new RuntimeException("Só é possível atualizar detalhes de pedidos pendentes ou em análise");
        }

        // Atualizar campos permitidos
        if (pedidoDTO.getAutomovelId() != null) {
            Automovel automovel = automovelRepository.findById(pedidoDTO.getAutomovelId())
                    .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));
            pedido.setAutomovel(automovel);
        }

        if (pedidoDTO.getPossuiContratoCredito() != null) {
            pedido.setPossuiContratoCredito(pedidoDTO.getPossuiContratoCredito());
        }

        if (pedidoDTO.getBancoContrato() != null) {
            pedido.setBancoContrato(pedidoDTO.getBancoContrato());
        }

        pedido.setDataModificacao(LocalDateTime.now());
        PedidoAluguel updatedPedido = pedidoRepository.save(pedido);
        return convertToDTO(updatedPedido);
    }

    public PedidoAluguelDTO modificarPedidoCompleto(Long id, PedidoAluguelDTO pedidoDTO, Long gestorId) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Verificar se o gestor tem permissão para modificar este pedido
        if (gestorId != null) {
            Agente gestor = agenteRepository.findById(gestorId)
                    .orElseThrow(() -> new RuntimeException("Gestor não encontrado"));
            
            // Verificar se o gestor pode gerenciar este pedido
            if (!podeGerenciarPedido(gestor, pedido)) {
                throw new RuntimeException("Gestor não tem permissão para modificar este pedido");
            }
        }

        // Permite modificação apenas se não estiver contratado
        if (pedido.getStatus() == PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Não é possível modificar um pedido já contratado");
        }

        // Atualizar campos
        if (pedidoDTO.getAutomovelId() != null) {
            Automovel automovel = automovelRepository.findById(pedidoDTO.getAutomovelId())
                    .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));
            pedido.setAutomovel(automovel);
        }

        if (pedidoDTO.getPossuiContratoCredito() != null) {
            pedido.setPossuiContratoCredito(pedidoDTO.getPossuiContratoCredito());
            
            // Se mudou para ter contrato de crédito, resetar o agente
            if (pedidoDTO.getPossuiContratoCredito() && pedido.getAgente() != null) {
                if (pedido.getAgente().getTipoAgente() == Agente.TipoAgente.GESTOR) {
                    pedido.setAgente(null); // Resetar agente se mudou para financiado
                }
            }
        }

        if (pedidoDTO.getBancoContrato() != null) {
            pedido.setBancoContrato(pedidoDTO.getBancoContrato());
        }

        // Atualizar status se fornecido
        if (pedidoDTO.getStatus() != null && !pedidoDTO.getStatus().isEmpty()) {
            try {
                PedidoAluguel.StatusPedido novoStatus = PedidoAluguel.StatusPedido.valueOf(pedidoDTO.getStatus().toUpperCase());
                pedido.setStatus(novoStatus);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Status inválido: " + pedidoDTO.getStatus());
            }
        }

        pedido.setDataModificacao(LocalDateTime.now());
        PedidoAluguel updatedPedido = pedidoRepository.save(pedido);
        return convertToDTO(updatedPedido);
    }

    private boolean podeGerenciarPedido(Agente gestor, PedidoAluguel pedido) {
        if (gestor.getTipoAgente() == Agente.TipoAgente.BANCO || 
            gestor.getTipoAgente() == Agente.TipoAgente.EMPRESA_FINANCEIRA) {
            // Agentes financeiros só podem gerenciar pedidos com contrato de crédito
            return pedido.getPossuiContratoCredito() != null && 
                   pedido.getPossuiContratoCredito() && 
                   gestor.getId().toString().equals(pedido.getBancoContrato());
        } else if (gestor.getTipoAgente() == Agente.TipoAgente.GESTOR) {
            // Gestores comuns só podem gerenciar pedidos sem contrato de crédito
            return pedido.getPossuiContratoCredito() == null || !pedido.getPossuiContratoCredito();
        }
        return false;
    }

    public void cancelarPedido(Long id) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Só permite cancelamento se o pedido não estiver em execução
        if (pedido.getStatus() == PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Não é possível cancelar um pedido já contratado");
        }

        pedido.setStatus(PedidoAluguel.StatusPedido.CANCELADO);
        pedido.setDataModificacao(LocalDateTime.now());
        pedidoRepository.save(pedido);
    }

    public PedidoAluguelDTO avaliarPedido(Long id, Long agenteId, boolean aprovado, String observacoes) {
        PedidoAluguel pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));

        // Atualizar status do pedido
        pedido.setStatus(aprovado ? PedidoAluguel.StatusPedido.APROVADO : PedidoAluguel.StatusPedido.REJEITADO);
        pedido.setAgente(agente);
        PedidoAluguel savedPedido = pedidoRepository.save(pedido);

        // Se aprovado, criar contrato automaticamente
        if (aprovado) {
            criarContratoAutomatico(savedPedido, agente, observacoes);
        }

        return convertToDTO(savedPedido);
    }

    private ContratoAluguel criarContratoAutomatico(PedidoAluguel pedido, Agente agente, String observacoes) {
        // Verificar se o cliente tem todos os dados necessários para o contrato
        Cliente cliente = pedido.getCliente();

        if (cliente.getRg() == null || cliente.getProfissao() == null) {
            throw new RuntimeException("Cliente precisa completar dados pessoais (RG e profissão) antes de assinar o contrato");
        }

        // Verificar se tem pelo menos um rendimento
        if (cliente.getRendimentos() == null || cliente.getRendimentos().isEmpty()) {
            throw new RuntimeException("Cliente precisa cadastrar pelo menos um rendimento antes de assinar o contrato");
        }

        // Criar contrato com valores padrão (depois o gestor pode editar)
        String observacoesCompletas = "Contrato criado automaticamente após aprovação do pedido";
        String observacoesTratadas = (observacoes != null) ? observacoes.trim() : "";
        if (!observacoesTratadas.isEmpty()) {
            observacoesCompletas += "\n\nObservações do agente: " + observacoesTratadas;
        }
        
        ContratoAluguel contrato = ContratoAluguel.builder()
                .pedido(pedido)
                .agente(agente)
                .numeroContrato(gerarNumeroContrato())
                .valorMensal(java.math.BigDecimal.valueOf(1000.00)) // Valor padrão
                .prazoMeses(12) // Prazo padrão
                .dataInicio(java.time.LocalDateTime.now())
                .dataFim(java.time.LocalDateTime.now().plusMonths(12))
                .status(ContratoAluguel.StatusContrato.ATIVO)
                .observacoes(observacoesCompletas)
                .build();

        ContratoAluguel savedContrato = contratoRepository.save(contrato);

        System.out.println("=== CONTRATO SALVO ===");
        System.out.println("Observacoes salvas: '" + savedContrato.getObservacoes() + "'");

        // Atualizar status do pedido para CONTRATADO
        pedido.setStatus(PedidoAluguel.StatusPedido.CONTRATADO);
        pedidoRepository.save(pedido);

        return savedContrato;
    }

    public ContratoAluguelDTO executarContrato(Long pedidoId, Long agenteId, 
                                             java.math.BigDecimal valorMensal, 
                                             Integer prazoMeses) {
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getStatus() != PedidoAluguel.StatusPedido.APROVADO) {
            throw new RuntimeException("Apenas pedidos aprovados podem ser contratados");
        }

        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));

        // Criar contrato
        ContratoAluguel contrato = ContratoAluguel.builder()
                .pedido(pedido)
                .agente(agente)
                .numeroContrato(gerarNumeroContrato())
                .valorMensal(valorMensal)
                .prazoMeses(prazoMeses)
                .dataInicio(java.time.LocalDateTime.now())
                .dataFim(java.time.LocalDateTime.now().plusMonths(prazoMeses))
                .status(ContratoAluguel.StatusContrato.ATIVO)
                .build();

        ContratoAluguel savedContrato = contratoRepository.save(contrato);

        // Atualizar status do pedido
        pedido.setStatus(PedidoAluguel.StatusPedido.CONTRATADO);
        pedidoRepository.save(pedido);

        return convertContratoToDTO(savedContrato);
    }

    public List<PedidoAluguelDTO> listarPedidosPorStatus(String status) {
        PedidoAluguel.StatusPedido statusEnum = PedidoAluguel.StatusPedido.valueOf(status.toUpperCase());
        return pedidoRepository.findByStatus(statusEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoAluguelDTO> listarPedidosGerenciaveisPorAgente(Long agenteId) {
        // Buscar o agente para verificar o tipo
        Agente agente = agenteRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));

        List<PedidoAluguel> pedidos;
        
        if (agente.getTipoAgente() == Agente.TipoAgente.BANCO || 
            agente.getTipoAgente() == Agente.TipoAgente.EMPRESA_FINANCEIRA) {
            // Agentes BANCO e EMPRESA_FINANCEIRA veem pedidos com contrato de crédito onde foram selecionados
            pedidos = pedidoRepository.findByPossuiContratoCreditoTrueAndBancoContrato(agente.getId().toString());
        } else if (agente.getTipoAgente() == Agente.TipoAgente.GESTOR) {
            // Gestores comuns gerenciam pedidos sem contrato de crédito (pedidos diretos)
            List<PedidoAluguel> pedidosSemCredito = pedidoRepository.findBySemContratoCredito();
            pedidos = pedidosSemCredito.stream()
                    .filter(p -> p.getAgente() == null || p.getAgente().getId().equals(agenteId))
                    .collect(Collectors.toList());
        } else {
            // Fallback para outros tipos
            pedidos = java.util.Collections.emptyList();
        }

        return pedidos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoAluguelDTO> listarPedidosPorAgente(Long agenteId) {
        return pedidoRepository.findByAgenteId(agenteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PedidoAluguelDTO> listarTodosPedidos() {
        return pedidoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ContratoAluguelDTO buscarContratoPorPedido(Long pedidoId) {
        // Verificar se o pedido existe
        PedidoAluguel pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        // Verificar se o pedido está contratado
        if (pedido.getStatus() != PedidoAluguel.StatusPedido.CONTRATADO) {
            throw new RuntimeException("Pedido não possui contrato ativo");
        }

        // Buscar o contrato
        ContratoAluguel contrato = contratoRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado para este pedido"));

        return convertContratoToDTO(contrato);
    }

    private PedidoAluguelDTO convertToDTO(PedidoAluguel pedido) {
        PedidoAluguelDTO.PedidoAluguelDTOBuilder builder = PedidoAluguelDTO.builder()
                .id(pedido.getId())
                .clienteId(pedido.getCliente().getId())
                .automovelId(pedido.getAutomovel().getId())
                .status(pedido.getStatus().name())
                .dataCriacao(pedido.getDataCriacao())
                .dataModificacao(pedido.getDataModificacao())
                .possuiContratoCredito(pedido.getPossuiContratoCredito())
                .bancoContrato(pedido.getBancoContrato());

        // Incluir informações do agente se existir
        if (pedido.getAgente() != null) {
            builder.agenteId(pedido.getAgente().getId())
                   .nomeAgente(pedido.getAgente().getNome())
                   .tipoAgente(pedido.getAgente().getTipoAgente().name());
        }

        return builder.build();
    }

    private ContratoAluguelDTO convertContratoToDTO(ContratoAluguel contrato) {
        return ContratoAluguelDTO.builder()
                .id(contrato.getId())
                .pedidoId(contrato.getPedido().getId())
                .agenteId(contrato.getAgente().getId())
                .numeroContrato(contrato.getNumeroContrato())
                .valorMensal(contrato.getValorMensal())
                .prazoMeses(contrato.getPrazoMeses())
                .dataInicio(contrato.getDataInicio())
                .dataFim(contrato.getDataFim())
                .status(contrato.getStatus().name())
                .dataCriacao(contrato.getDataCriacao())
                .dataModificacao(contrato.getDataModificacao())
                .observacoes(contrato.getObservacoes())
                .build();
    }

    private String gerarNumeroContrato() {
        return "CTR" + System.currentTimeMillis();
    }
}
