package com.example.Aluguel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long id;
    private String password;
    private String email;
    private String role;
    private Boolean ativo;
}
