package com.example.Aluguel.service;

import com.example.Aluguel.dto.AdminDTO;
import com.example.Aluguel.entities.Admin;
import com.example.Aluguel.entities.Usuario;
import com.example.Aluguel.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDTO criar(AdminDTO dto) {
        Admin admin = Admin.builder()
                .email(dto.getEmail())
                .nome(dto.getNome())
                .password(passwordEncoder.encode("admin123"))
                .role(Usuario.Role.ADMIN)
                .ativo(true)
                .build();
        Admin saved = (Admin) usuarioRepository.save(admin);
        return convert(saved);
    }

    public List<AdminDTO> listar() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u instanceof Admin)
                .map(u -> convert((Admin) u))
                .collect(Collectors.toList());
    }

    public AdminDTO obter(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));
        if (!(u instanceof Admin)) {
            throw new RuntimeException("Usuário não é Admin");
        }
        return convert((Admin) u);
    }

    public AdminDTO atualizar(Long id, AdminDTO dto) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado"));
        if (!(u instanceof Admin)) {
            throw new RuntimeException("Usuário não é Admin");
        }
        Admin admin = (Admin) u;
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        Admin saved = (Admin) usuarioRepository.save(admin);
        return convert(saved);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    private AdminDTO convert(Admin admin) {
        return AdminDTO.builder()
                .id(admin.getId())
                .nome(admin.getNome())
                .email(admin.getEmail())
                .ativo(admin.getAtivo())
                .build();
    }
}



