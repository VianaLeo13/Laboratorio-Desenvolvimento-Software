package com.example.Aluguel.service;

import com.example.Aluguel.dto.UsuarioDTO;
import com.example.Aluguel.entities.Usuario;
import com.example.Aluguel.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioDTO criarUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("Email já existe");
        }

        Usuario usuario = com.example.Aluguel.entities.Cliente.builder()
                .password(passwordEncoder.encode(usuarioDTO.getPassword() != null ? usuarioDTO.getPassword() : "123456"))
                .email(usuarioDTO.getEmail())
                .nome("Usuário")
                .role(Usuario.Role.valueOf(usuarioDTO.getRole()))
                .ativo(true)
                .build();

        Usuario savedUsuario = usuarioRepository.save(usuario);
        return convertToDTO(savedUsuario);
    }

    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return convertToDTO(usuario);
    }

    public void alterarSenha(String email, String novaSenha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .password(usuario.getPassword())
                .email(usuario.getEmail())
                .role(usuario.getRole().name())
                .ativo(usuario.getAtivo())
                .build();
    }
}
