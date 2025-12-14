package com.moedas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "usar_vantagem")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsarVantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;
}
