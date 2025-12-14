package com.example.Aluguel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendimentoDTO {
    private Long id;
    private String entidadeEmpregadora;
    private Double valor;
    private Long clienteId;
}