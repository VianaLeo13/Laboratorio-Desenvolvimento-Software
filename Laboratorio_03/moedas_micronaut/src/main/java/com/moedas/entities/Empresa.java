package com.moedas.entities;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "empresa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Serdeable
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cnpj;

    private String razaoSocial;

    private String telefone;

    private String email;
    private String senha;

    public String getRole() {
        return "EMPRESA";
    }
}
