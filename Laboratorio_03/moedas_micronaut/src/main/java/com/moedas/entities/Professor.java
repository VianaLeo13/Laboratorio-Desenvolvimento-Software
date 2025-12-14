package com.moedas.entities;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "professor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Serdeable
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;

    private String cpf;

    private String departamento;

    @ManyToOne
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    private double saldoMoedas;

    public String getRole() {
        return "PROFESSOR";
    }
}