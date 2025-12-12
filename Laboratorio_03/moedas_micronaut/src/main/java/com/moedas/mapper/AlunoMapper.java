package com.moedas.mapper;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;

//Classe mapper para centralizar conversões entre DTOs e entidades
public final class AlunoMapper {

    private AlunoMapper() {}

    public static Aluno toEntity(CreateAlunoRequestDTO dto) {
        return Aluno.builder()
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .rg(dto.getRg())
                .endereco(dto.getEndereco())
                .build();
    }

    public static CreateAlunoResponseDTO toDto(Aluno aluno) {
        return CreateAlunoResponseDTO.builder()
                .id(aluno.getId())
                .email(aluno.getEmail())
                .nome(aluno.getNome())
                .endereco(aluno.getEndereco())
                .rg(aluno.getRg())
                .cpf(aluno.getCpf())
                .build();
    }
}