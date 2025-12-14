package com.moedas.services;

import com.moedas.dto.response.AuthResponse;
import com.moedas.dto.request.LoginRequest;
import com.moedas.entities.Aluno;
import com.moedas.entities.Empresa;
import com.moedas.entities.Professor;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.EmpresaRepository;
import com.moedas.repositories.ProfessorRepository;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.errors.OauthErrorResponseException;
import io.micronaut.security.token.jwt.generator.JwtTokenGenerator;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaRepository empresaRepository;
    private final JwtTokenGenerator tokenGenerator;

    public AuthResponse login(LoginRequest request) {
        // Tentar encontrar como Aluno
        Optional<Aluno> aluno = alunoRepository.findByEmail(request.getEmail());
        if (aluno.isPresent() && aluno.get().getSenha().equals(request.getSenha())) {
            return generateToken(aluno.get().getEmail(), "ALUNO", aluno.get().getId(), aluno.get().getNome());
        }

        // Tentar encontrar como Professor
        Optional<Professor> professor = professorRepository.findByEmail(request.getEmail());
        if (professor.isPresent() && professor.get().getSenha().equals(request.getSenha())) {
            return generateToken(professor.get().getEmail(), "PROFESSOR", professor.get().getId(), professor.get().getNome());
        }

        // Tentar encontrar como Empresa
        Optional<Empresa> empresa = empresaRepository.findByEmail(request.getEmail());
        if (empresa.isPresent() && empresa.get().getSenha().equals(request.getSenha())) {
            return generateToken(empresa.get().getEmail(), "EMPRESA", empresa.get().getId(), empresa.get().getRazaoSocial());
        }

        throw new RuntimeException("Credenciais inválidas");
    }

    private AuthResponse generateToken(String email, String role, Long userId, String nome) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        claims.put("nome", nome);

        Optional<String> token = tokenGenerator.generateToken(claims);

        if (token.isPresent()) {
            log.info("Login realizado com sucesso: {} - {}", email, role);
            return AuthResponse.builder()
                    .token(token.get())
                    .tipo("Bearer")
                    .role(role)
                    .userId(userId)
                    .nome(nome)
                    .build();
        }

        throw new RuntimeException("Erro ao gerar token");
    }
}