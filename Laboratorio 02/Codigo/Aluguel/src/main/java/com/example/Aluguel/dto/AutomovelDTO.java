package com.example.Aluguel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutomovelDTO {
    private Long id;
    private String placa;
    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String tipoPropriedade;
}
