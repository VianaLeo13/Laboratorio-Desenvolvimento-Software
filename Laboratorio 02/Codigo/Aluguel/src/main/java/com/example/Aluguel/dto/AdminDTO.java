package com.example.Aluguel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDTO {
    private Long id;
    private String nome;
    private String email;
    private Boolean ativo;
}



