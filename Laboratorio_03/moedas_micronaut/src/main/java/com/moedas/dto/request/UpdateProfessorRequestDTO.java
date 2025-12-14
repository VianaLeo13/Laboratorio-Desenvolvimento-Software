package com.moedas.dto.request;

import com.moedas.entities.Instituicao;
import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class UpdateProfessorRequestDTO {

    private String nome;
    private String email;
    private String senha;

    private String cpf;

    private String departamento;

    private Instituicao instituicao;
}
