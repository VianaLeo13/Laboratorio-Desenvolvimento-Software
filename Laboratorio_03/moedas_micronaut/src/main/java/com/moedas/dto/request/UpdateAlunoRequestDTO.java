package com.moedas.dto.request;

import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class UpdateAlunoRequestDTO {
    private String cpf;
    private String rg;
    private String nome;
    private String endereco;
}
