package com.example.Aluguel.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "automoveis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placa;

    @Column(nullable = false)
    private String matricula;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Enumerated(EnumType.STRING)
    private TipoPropriedade tipoPropriedade;

    public enum TipoPropriedade {
        CLIENTE, EMPRESA, BANCO
    }
}
