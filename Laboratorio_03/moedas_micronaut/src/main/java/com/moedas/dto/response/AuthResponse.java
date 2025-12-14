package com.moedas.dto.response;

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
public class AuthResponse {
    private String token;
    private String tipo;
    private String role;
    private Long userId;
    private String nome;
}