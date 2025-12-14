package com.example.Aluguel.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlterarSenhaDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}



