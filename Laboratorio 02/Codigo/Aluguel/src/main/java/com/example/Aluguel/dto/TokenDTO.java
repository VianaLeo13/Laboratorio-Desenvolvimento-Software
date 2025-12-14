package com.example.Aluguel.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDTO {
    private String token;
    private String type;
    private String username;
    private String role;
}

