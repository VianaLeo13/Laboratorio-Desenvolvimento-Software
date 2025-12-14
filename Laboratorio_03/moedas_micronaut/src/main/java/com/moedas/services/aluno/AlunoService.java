package com.moedas.services.aluno;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.request.UpdateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.repositories.AlunoRepository;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.*;

@Singleton
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;

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

        Aluno aluno = createEntity(createAlunoRequestDTO);
        aluno = alunoRepository.save(aluno);
        return createDTO(aluno);
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

        return createDTO(aluno);
    }

    public CreateAlunoResponseDTO viewPerfil(long id){
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno com o id inexistente"));

        System.out.println(aluno.getEmail());
        return createDTO(aluno);
    }

    public List<CreateAlunoResponseDTO> lista(){
        List<Aluno> alunos = alunoRepository.findAll();

        return alunos.stream()
                .map(aluno -> CreateAlunoResponseDTO.builder()
                        .id(aluno.getId())
                        .cpf(aluno.getCpf())
                        .email(aluno.getEmail())
                        .rg(aluno.getRg())
                        .senha(aluno.getSenha())
                        .endereco(aluno.getEndereco())
                        .nome(aluno.getNome()).build()).toList();
    }

    public void delete(long id) {
        if (!alunoRepository.existsById(id)) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Aluno com o id inexistente");
        }
        alunoRepository.deleteById(id);
    }

    private Aluno createEntity(CreateAlunoRequestDTO createAlunoRequestDTO) {
        return Aluno.builder()
                .nome(createAlunoRequestDTO.getNome())
                .cpf(createAlunoRequestDTO.getCpf())
                .email(createAlunoRequestDTO.getEmail())
                .senha(createAlunoRequestDTO.getSenha())
                .rg(createAlunoRequestDTO.getRg())
                .endereco(createAlunoRequestDTO.getEndereco())
                .build();
    }

    private CreateAlunoResponseDTO createDTO(Aluno aluno) {
        return CreateAlunoResponseDTO.builder()
                .id(aluno.getId())
                .email(aluno.getEmail())
                .senha(aluno.getSenha())
                .nome(aluno.getNome())
                .endereco(aluno.getEndereco())
                .rg(aluno.getRg())
                .cpf(aluno.getCpf())
                .build();
    }
}
