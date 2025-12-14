package com.moedas.dto.request;

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
public class UpdateEmpresaRequestDTO {
    private String cnpj;

    private String razaoSocial;

    private String telefone;

}
