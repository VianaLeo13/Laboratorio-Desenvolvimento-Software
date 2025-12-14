package com.moedas.dto.request;

import io.micronaut.core.annotation.Internal;
import io.micronaut.core.annotation.Introspected;
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
public class CreateAlunoRequestDTO {
    private String cpf;
    private String rg;
    private String nome;
    private String email;
    private String senha;
    private String endereco;
}
