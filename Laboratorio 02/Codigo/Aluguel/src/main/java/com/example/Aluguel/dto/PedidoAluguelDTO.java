package com.example.Aluguel.dto;

import java.time.LocalDateTime;

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
public class PedidoAluguelDTO {
    private Long id;
    private Long clienteId;
    private Long automovelId;
    private Long agenteId;
    private String nomeAgente;
    private String tipoAgente;
    private String status;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataModificacao;
    private Boolean possuiContratoCredito;
    private String bancoContrato;
}