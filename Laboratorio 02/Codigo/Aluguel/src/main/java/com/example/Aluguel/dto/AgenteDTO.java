package com.example.Aluguel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgenteDTO {
    private Long id;
    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String tipoAgente;
    private Boolean ativo;
    private String email;
    private String password;
}

