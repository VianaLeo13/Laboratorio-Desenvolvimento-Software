package com.moedas.services;

import com.moedas.dto.request.CreateProfessorRequestDTO;
import com.moedas.dto.request.TransacaoRequest;
import com.moedas.dto.request.UpdateProfessorRequestDTO;
import com.moedas.dto.response.ProfessorResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.entities.Professor;
import com.moedas.entities.Transacao;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.ProfessorRepository;
import com.moedas.repositories.TransacaoRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@Singleton
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final TransacaoRepository transacaoRepository;
    private final AlunoRepository alunoRepository;

    public ProfessorResponseDTO create(CreateProfessorRequestDTO createProfessorRequestDTO) {
        if (createProfessorRequestDTO.getCpf() == null || createProfessorRequestDTO.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }

        if (createProfessorRequestDTO.getEmail() == null || createProfessorRequestDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }

        if (createProfessorRequestDTO.getSenha() == null || createProfessorRequestDTO.getSenha().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        Professor professor = createEntity(createProfessorRequestDTO);
        professor = professorRepository.save(professor);
        return createDTO(professor);
    }

    public ProfessorResponseDTO update(UpdateProfessorRequestDTO dto, long id) {
        if (dto == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Dados de atualização não fornecidos");
        }

        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Professor com o id inexistente"));

        if (dto.getNome() != null) professor.setNome(dto.getNome());
        if (dto.getCpf() != null) professor.setCpf(dto.getCpf());
        if (dto.getEmail() != null) professor.setEmail(dto.getEmail());
        if (dto.getSenha() != null) professor.setSenha(dto.getSenha());
        if (dto.getDepartamento() != null) professor.setDepartamento(dto.getDepartamento());
        if (dto.getInstituicao() != null) professor.setInstituicao(dto.getInstituicao());

        professorRepository.update(professor);

        return createDTO(professor);
    }

    public ProfessorResponseDTO viewPerfil(long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Professor com o id inexistente"));

        return createDTO(professor);
    }

    public List<ProfessorResponseDTO> lista() {
        List<Professor> professores = professorRepository.findAll();

        return professores.stream()
                .map(this::createDTO)
                .toList();
    }

    public void delete(long id) {
        if (!professorRepository.existsById(id)) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Professor com o id inexistente");
        }
        professorRepository.deleteById(id);
    }

    public void adicionarMoedasSemestrais() {
        professorRepository.findAll().forEach(professor -> {
            double novoSaldo = professor.getSaldoMoedas() + 100000;
            professor.setSaldoMoedas(novoSaldo);
            professorRepository.update(professor);
        });
    }

    public Transacao distribuirMoedas(Long professorId, TransacaoRequest request) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (professor.getSaldoMoedas() < request.getQuantidadeMoedas()) {
            throw new RuntimeException("Saldo insuficiente do professor");
        }

        if (request.getQuantidadeMoedas() <= 0) {
            throw new RuntimeException("Quantidade de moedas deve ser maior que zero");
        }

        // Atualizar saldos
        professor.setSaldoMoedas(professor.getSaldoMoedas() - request.getQuantidadeMoedas());
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + request.getQuantidadeMoedas());

        professorRepository.update(professor);
        alunoRepository.update(aluno);

        Transacao transacao = Transacao.builder()
                .professor(professor)
                .aluno(aluno)
                .quantidadeMoedas(request.getQuantidadeMoedas())
                .motivo(request.getMotivo())
                .dataHora(LocalDateTime.now())
                .build();

        transacao = transacaoRepository.save(transacao);

        return transacao;
    }

    private Professor createEntity(CreateProfessorRequestDTO createProfessorRequestDTO) {
        return Professor.builder()
                .nome(createProfessorRequestDTO.getNome())
                .cpf(createProfessorRequestDTO.getCpf())
                .email(createProfessorRequestDTO.getEmail())
                .senha(createProfessorRequestDTO.getSenha())
                .departamento("") // valor padrão ou ajuste conforme necessidade
                .instituicao(null) // valor padrão ou ajuste conforme necessidade
                .saldoMoedas(0.0) // valor inicial
                .build();
    }

    private ProfessorResponseDTO createDTO(Professor professor) {
        return ProfessorResponseDTO.builder()
                .id(professor.getId())
                .nome(professor.getNome())
                .email(professor.getEmail())
                .senha(professor.getSenha())
                .cpf(professor.getCpf())
                .departamento(professor.getDepartamento())
                .instituicao(professor.getInstituicao())
                .saldoMoedas(professor.getSaldoMoedas())
                .build();
    }
}