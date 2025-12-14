package com.example.Aluguel.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Aluguel.dto.RendimentoDTO;
import com.example.Aluguel.entities.Cliente;
import com.example.Aluguel.entities.Rendimento;
import com.example.Aluguel.repository.ClienteRepository;
import com.example.Aluguel.repository.RendimentoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RendimentoService {

    private final RendimentoRepository rendimentoRepository;
    private final ClienteRepository clienteRepository;

    public RendimentoDTO criarRendimento(RendimentoDTO rendimentoDTO) {
        Cliente cliente = clienteRepository.findById(rendimentoDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        // Verificar se o cliente já tem 3 rendimentos (máximo)
        List<Rendimento> rendimentosExistentes = rendimentoRepository.findByClienteId(cliente.getId());
        if (rendimentosExistentes.size() >= 3) {
            throw new RuntimeException("Cliente já possui o máximo de 3 rendimentos cadastrados");
        }

        Rendimento rendimento = Rendimento.builder()
                .entidadeEmpregadora(rendimentoDTO.getEntidadeEmpregadora())
                .valor(rendimentoDTO.getValor())
                .cliente(cliente)
                .build();

        Rendimento savedRendimento = rendimentoRepository.save(rendimento);
        return convertToDTO(savedRendimento);
    }

    public List<RendimentoDTO> listarRendimentosPorCliente(Long clienteId) {
        return rendimentoRepository.findByClienteId(clienteId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RendimentoDTO> listarTodosRendimentos() {
        return rendimentoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RendimentoDTO atualizarRendimento(Long id, RendimentoDTO rendimentoDTO) {
        Rendimento rendimento = rendimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendimento não encontrado"));

        rendimento.setEntidadeEmpregadora(rendimentoDTO.getEntidadeEmpregadora());
        rendimento.setValor(rendimentoDTO.getValor());

        Rendimento updatedRendimento = rendimentoRepository.save(rendimento);
        return convertToDTO(updatedRendimento);
    }

    public void deletarRendimento(Long id) {
        Rendimento rendimento = rendimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendimento não encontrado"));
        
        rendimentoRepository.delete(rendimento);
    }

    private RendimentoDTO convertToDTO(Rendimento rendimento) {
        return RendimentoDTO.builder()
                .id(rendimento.getId())
                .entidadeEmpregadora(rendimento.getEntidadeEmpregadora())
                .valor(rendimento.getValor())
                .clienteId(rendimento.getCliente().getId())
                .build();
    }
}
