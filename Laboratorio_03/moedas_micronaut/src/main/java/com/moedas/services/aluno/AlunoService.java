package com.moedas.services.aluno;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.request.UpdateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.entities.Transacao;
import com.moedas.mapper.AlunoMapper;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.TransacaoRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Singleton
@RequiredArgsConstructor
public class AlunoService {

    //Adiciona repositórios necessários, ajusta DTOs de AlunoResponse para não retornar a senha diretamente e adiciona mapper ao invés da conversão manual

    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;

    public CreateAlunoResponseDTO create(CreateAlunoRequestDTO createAlunoRequestDTO) {
        if (createAlunoRequestDTO.getCpf() == null || createAlunoRequestDTO.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório");
        }

        if (createAlunoRequestDTO.getEmail() == null || createAlunoRequestDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email é obrigatório");
        }

        if (createAlunoRequestDTO.getSenha() == null || createAlunoRequestDTO.getSenha().trim().isEmpty()) {
            throw new IllegalArgumentException("Senha é obrigatória");
        }

        Aluno aluno = AlunoMapper.toEntity(createAlunoRequestDTO);
        aluno = alunoRepository.save(aluno);
        return AlunoMapper.toDto(aluno);
    }

    public CreateAlunoResponseDTO update(UpdateAlunoRequestDTO dto, long id) {
        if (dto == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST, "Dados de atualização não fornecidos");
        }

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno com o id inexistente"));

        if (dto.getNome() != null) aluno.setNome(dto.getNome());
        if (dto.getCpf() != null) aluno.setCpf(dto.getCpf());
        if (dto.getEndereco() != null) aluno.setEndereco(dto.getEndereco());
        if (dto.getRg() != null) aluno.setRg(dto.getRg());

        alunoRepository.update(aluno);

        return AlunoMapper.toDto(aluno);
    }

    public CreateAlunoResponseDTO viewPerfil(long id){
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno com o id inexistente"));

        System.out.println(aluno.getEmail());
        return AlunoMapper.toDto(aluno);
    }

    public List<CreateAlunoResponseDTO> lista(){
        List<Aluno> alunos = alunoRepository.findAll();

        return alunos.stream()
                .map(AlunoMapper::toDto)
                .toList();
    }

    public void delete(long id) {
        if (!alunoRepository.existsById(id)) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno com o id inexistente");
        }
        alunoRepository.deleteById(id);
    }

    public List<Transacao> getExtratoTransacoes(Long id) {
        return transacaoRepository.findByAlunoIdOrderByDataHoraDesc(id);
    }

    public Double getSaldo(Long id) {
        Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        return aluno.getSaldoMoedas();
    }
}
