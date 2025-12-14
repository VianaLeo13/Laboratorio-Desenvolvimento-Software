package com.example.Aluguel.service;

import com.example.Aluguel.dto.AgenteDTO;
import com.example.Aluguel.entities.Agente;
import com.example.Aluguel.repository.AgenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final PasswordEncoder passwordEncoder;

    public AgenteDTO criarAgente(AgenteDTO agenteDTO) {
        if (agenteRepository.existsByCnpj(agenteDTO.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        
        if (agenteRepository.existsByEmail(agenteDTO.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Agente agente = Agente.builder()
                .nome(agenteDTO.getNome())
                .cnpj(agenteDTO.getCnpj())
                .endereco(agenteDTO.getEndereco())
                .telefone(agenteDTO.getTelefone())
                .tipoAgente(Agente.TipoAgente.valueOf(agenteDTO.getTipoAgente()))
                .email(agenteDTO.getEmail())
                .password(passwordEncoder.encode(agenteDTO.getPassword()))
                .ativo(true)
                .build();

        Agente savedAgente = agenteRepository.save(agente);
        return convertToDTO(savedAgente);
    }

    public List<AgenteDTO> listarAgentes() {
        return agenteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AgenteDTO> listarAgentesAtivos() {
        return agenteRepository.findByAtivoTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AgenteDTO> listarAgentesPorTipo(String tipo) {
        Agente.TipoAgente tipoEnum = Agente.TipoAgente.valueOf(tipo.toUpperCase());
        return agenteRepository.findByTipoAgente(tipoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AgenteDTO buscarPorId(Long id) {
        Agente agente = agenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));
        return convertToDTO(agente);
    }

    public AgenteDTO autenticarAgente(String email, String password) {
        Agente agente = agenteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado"));
        
        if (!agente.getAtivo()) {
            throw new RuntimeException("Agente inativo");
        }
        
        if (!passwordEncoder.matches(password, agente.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }
        
        return convertToDTO(agente);
    }

    private AgenteDTO convertToDTO(Agente agente) {
        return AgenteDTO.builder()
                .id(agente.getId())
                .nome(agente.getNome())
                .cnpj(agente.getCnpj())
                .endereco(agente.getEndereco())
                .telefone(agente.getTelefone())
                .tipoAgente(agente.getTipoAgente().name())
                .ativo(agente.getAtivo())
                .email(agente.getEmail())
                .build(); // Não incluir password por segurança
    }
}
