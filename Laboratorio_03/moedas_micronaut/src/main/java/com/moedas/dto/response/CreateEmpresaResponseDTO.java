package com.moedas.dto.response;

import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class CreateEmpresaResponseDTO {

    private Long id;

    private String cnpj;

    private String razaoSocial;

    private String telefone;

    private String email;
    private String senha;
}
