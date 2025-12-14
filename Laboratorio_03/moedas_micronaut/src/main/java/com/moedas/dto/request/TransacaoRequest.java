package com.moedas.dto.request;

import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
@Builder
public class TransacaoRequest {
    private Long alunoId;
    private double quantidadeMoedas;
    private String motivo;
}