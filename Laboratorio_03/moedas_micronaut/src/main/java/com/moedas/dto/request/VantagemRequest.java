package com.moedas.dto.request;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import lombok.Data;

@Serdeable
@Introspected
@Data
public class VantagemRequest {
    private String nome;
    private String descricao;
    private String fotoUrl;
    private double custoMoedas;
}