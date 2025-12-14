package com.example.Aluguel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.Aluguel.dto.ClienteDTO;
import com.example.Aluguel.dto.RendimentoDTO;
import com.example.Aluguel.service.ClienteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cliente")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://127.0.0.1:8000", "file://"})
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping("/cadastrar")
    public ResponseEntity<ClienteDTO> createCliente(@Valid @RequestBody ClienteDTO clienteDTO,
                                                    UriComponentsBuilder uriBuilder) {
        ClienteDTO createdCliente = clienteService.createCliente(clienteDTO);
        var location = uriBuilder.path("/cliente/{id}").buildAndExpand(createdCliente.getId()).toUri();
        return ResponseEntity.created(location).body(createdCliente);
    }

    @PostMapping("/cadastrar-com-rendimento")
    public ResponseEntity<Object> createClienteComRendimento(@RequestBody java.util.Map<String, Object> request,
                                                           UriComponentsBuilder uriBuilder) {
        try {
            // Extrair dados do cliente
            ClienteDTO clienteDTO = ClienteDTO.builder()
                    .nome((String) request.get("nome"))
                    .cpf((String) request.get("cpf"))
                    .endereco((String) request.get("endereco"))
                    .rg((String) request.get("rg"))
                    .profissao((String) request.get("profissao"))
                    .email((String) request.get("email"))
                    .password((String) request.get("password"))
                    .build();

            // Extrair dados do rendimento (se fornecidos)
            RendimentoDTO rendimentoDTO = null;
            if (request.containsKey("empresa") && request.containsKey("salario")) {
                String empresa = (String) request.get("empresa");
                Object salarioObj = request.get("salario");
                
                if (empresa != null && !empresa.trim().isEmpty() && salarioObj != null) {
                    Double salario = null;
                    if (salarioObj instanceof Number) {
                        salario = ((Number) salarioObj).doubleValue();
                    } else if (salarioObj instanceof String) {
                        try {
                            salario = Double.parseDouble((String) salarioObj);
                        } catch (NumberFormatException e) {
                            // Ignorar se não for um número válido
                        }
                    }
                    
                    if (salario != null && salario > 0) {
                        rendimentoDTO = RendimentoDTO.builder()
                                .entidadeEmpregadora(empresa)
                                .valor(salario)
                                .build();
                    }
                }
            }

            ClienteDTO createdCliente = clienteService.createClienteComRendimento(clienteDTO, rendimentoDTO);
            var location = uriBuilder.path("/cliente/{id}").buildAndExpand(createdCliente.getId()).toUri();
            return ResponseEntity.created(location).body(createdCliente);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("erro", e.getMessage()));
        }
    }

    // Poderíamos também expor endpoint para alterar senha do cliente, mas manteremos na Auth.

    @GetMapping("/listar")
    public ResponseEntity<List<ClienteDTO>> getAllClientes() {
        List<ClienteDTO> clientes = clienteService.getAllClientes();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> getClienteById(@PathVariable Long id) {
        ClienteDTO cliente = clienteService.getClienteById(id);
        return ResponseEntity.ok(cliente);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<ClienteDTO> updateCliente(@PathVariable Long id, @Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO updatedCliente = clienteService.updateCliente(id, clienteDTO);
        return ResponseEntity.ok(updatedCliente);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        clienteService.deleteCliente(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
