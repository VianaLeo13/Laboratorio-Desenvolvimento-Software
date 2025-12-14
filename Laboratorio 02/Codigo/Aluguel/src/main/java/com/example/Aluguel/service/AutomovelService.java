package com.example.Aluguel.service;

import com.example.Aluguel.dto.AutomovelDTO;
import com.example.Aluguel.entities.Automovel;
import com.example.Aluguel.repository.AutomovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelDTO criarAutomovel(AutomovelDTO automovelDTO) {
        if (automovelRepository.existsByPlaca(automovelDTO.getPlaca())) {
            throw new RuntimeException("Placa já cadastrada");
        }

        Automovel automovel = Automovel.builder()
                .placa(automovelDTO.getPlaca())
                .matricula(automovelDTO.getMatricula())
                .ano(automovelDTO.getAno())
                .marca(automovelDTO.getMarca())
                .modelo(automovelDTO.getModelo())
                .tipoPropriedade(Automovel.TipoPropriedade.valueOf(automovelDTO.getTipoPropriedade()))
                .build();

        Automovel savedAutomovel = automovelRepository.save(automovel);
        return convertToDTO(savedAutomovel);
    }

    public List<AutomovelDTO> listarAutomoveis() {
        return automovelRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AutomovelDTO buscarPorId(Long id) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));
        return convertToDTO(automovel);
    }

    public AutomovelDTO atualizarAutomovel(Long id, AutomovelDTO automovelDTO) {
        Automovel automovel = automovelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));

        automovel.setPlaca(automovelDTO.getPlaca());
        automovel.setMatricula(automovelDTO.getMatricula());
        automovel.setAno(automovelDTO.getAno());
        automovel.setMarca(automovelDTO.getMarca());
        automovel.setModelo(automovelDTO.getModelo());
        automovel.setTipoPropriedade(Automovel.TipoPropriedade.valueOf(automovelDTO.getTipoPropriedade()));

        Automovel updatedAutomovel = automovelRepository.save(automovel);
        return convertToDTO(updatedAutomovel);
    }

    public void deletarAutomovel(Long id) {
        automovelRepository.deleteById(id);
    }

    private AutomovelDTO convertToDTO(Automovel automovel) {
        return AutomovelDTO.builder()
                .id(automovel.getId())
                .placa(automovel.getPlaca())
                .matricula(automovel.getMatricula())
                .ano(automovel.getAno())
                .marca(automovel.getMarca())
                .modelo(automovel.getModelo())
                .tipoPropriedade(automovel.getTipoPropriedade().name())
                .build();
    }
}

