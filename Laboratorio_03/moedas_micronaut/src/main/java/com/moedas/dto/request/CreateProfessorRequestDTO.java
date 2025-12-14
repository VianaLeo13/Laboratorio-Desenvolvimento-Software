package com.moedas.dto.request;

import com.moedas.entities.Instituicao;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class CreateProfessorRequestDTO {

    private String nome;
    private String email;
    private String senha;
    private String cpf;
}
