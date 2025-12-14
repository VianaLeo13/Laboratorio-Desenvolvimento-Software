package com.example.Aluguel.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class ClienteDTO {
    private Long id;

    @NotBlank
    private String cpf;

    @NotBlank
    private String nome;

    @NotBlank
    private String endereco;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
    
    // Campos adicionais para contrato
    private String rg;
    
    private String profissao;
    
    // Lista de rendimentos
    private java.util.List<RendimentoDTO> rendimentos;
}