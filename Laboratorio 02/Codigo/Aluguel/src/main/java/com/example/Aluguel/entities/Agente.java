package com.example.Aluguel.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agentes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String cnpj;

    private String endereco;

    private String telefone;

    @Enumerated(EnumType.STRING)
    private TipoAgente tipoAgente;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    // Campos para autenticação
    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public enum TipoAgente {
        BANCO, EMPRESA_FINANCEIRA, GESTOR
    }
}
