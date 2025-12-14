package com.moedas.services.empresa;

import com.moedas.dto.request.CreateEmpresaRequestDTO;
import com.moedas.dto.request.UpdateEmpresaRequestDTO;
import com.moedas.dto.response.CreateEmpresaResponseDTO;
import com.moedas.entities.Empresa;
import com.moedas.repositories.EmpresaRepository;
import io.micronaut.core.annotation.NonNull;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.exceptions.HttpStatusException;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Singleton
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public CreateEmpresaResponseDTO createEmpresa(CreateEmpresaRequestDTO createEmpresaRequestDTO) {
        Empresa empresa = createEmpresaEntity(createEmpresaRequestDTO);
        empresa = empresaRepository.save(empresa);
        return createEmpresaDTO(empresa);
    }

    public CreateEmpresaResponseDTO updateEmpresa(UpdateEmpresaRequestDTO updateEmpresaRequestDTO, Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new HttpStatusException(HttpStatus.NOT_FOUND, "Empresa com o id inexistente"));

        empresa.setCnpj(updateEmpresaRequestDTO.getCnpj());
        empresa.setTelefone(updateEmpresaRequestDTO.getTelefone());
        empresa.setRazaoSocial(updateEmpresaRequestDTO.getRazaoSocial());

        empresaRepository.update(empresa);

        return createEmpresaDTO(empresa);
    }

    public void deletaEmpresa(Long id){
        try {
            empresaRepository.deleteById(id);
        }catch (Exception e){
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Empresa com o id inexistente");
        }
    }

    public CreateEmpresaResponseDTO viewEmpresa(Long id) {
        if (!empresaRepository.existsById(id)) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND, "Empresa com o id inexistente");
        }

        Empresa empresa = empresaRepository.findById(id).get();

        return createEmpresaDTO(empresa);
    }

    public List<CreateEmpresaResponseDTO> lista(){
        List<Empresa> empresas = empresaRepository.findAll();

        return empresas.stream()
                .map(empresa -> CreateEmpresaResponseDTO.builder()
                        .id(empresa.getId())
                        .telefone(empresa.getTelefone())
                        .cnpj(empresa.getCnpj())
                        .senha(empresa.getSenha())
                        .email(empresa.getEmail())
                        .razaoSocial(empresa.getRazaoSocial()).build()).toList();
    }

    private Empresa createEmpresaEntity(CreateEmpresaRequestDTO createEmpresaRequestDTO) {
        return Empresa.builder()
                .email(createEmpresaRequestDTO.getEmail())
                .senha(createEmpresaRequestDTO.getSenha())
                .cnpj(createEmpresaRequestDTO.getCnpj())
                .telefone(createEmpresaRequestDTO.getTelefone())
                .razaoSocial(createEmpresaRequestDTO.getRazaoSocial())
                .build();
    }
    private CreateEmpresaResponseDTO createEmpresaDTO(Empresa empresa) {
        return CreateEmpresaResponseDTO.builder()
                .id(empresa.getId())
                .cnpj(empresa.getCnpj())
                .razaoSocial(empresa.getRazaoSocial())
                .email(empresa.getEmail())
                .senha(empresa.getSenha())
                .telefone(empresa.getTelefone())
                .build();
    }
}
