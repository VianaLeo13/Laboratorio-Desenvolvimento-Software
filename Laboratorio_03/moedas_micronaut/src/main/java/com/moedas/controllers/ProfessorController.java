package com.moedas.controllers;

import com.moedas.dto.request.CreateProfessorRequestDTO;
import com.moedas.dto.request.TransacaoRequest;
import com.moedas.dto.request.UpdateProfessorRequestDTO;
import com.moedas.dto.response.ProfessorResponseDTO;
import com.moedas.entities.Transacao;
import com.moedas.repositories.TransacaoRepository;
import com.moedas.services.ProfessorService;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.*;

import java.util.List;
import java.util.Map;

@Controller("/professores")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class ProfessorController {

    private final TransacaoRepository transacaoRepository;
    private final ProfessorService professorService;

    @Post
    @Status(HttpStatus.CREATED)
    @Secured(SecurityRule.IS_ANONYMOUS)
    public ProfessorResponseDTO create(@Body CreateProfessorRequestDTO createProfessorRequestDTO) {
        return professorService.create(createProfessorRequestDTO);
    }

    @Put("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public ProfessorResponseDTO update(@Body UpdateProfessorRequestDTO updateProfessorRequestDTO, @PathVariable long id) {
        return professorService.update(updateProfessorRequestDTO, id);
    }

    @Get("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public ProfessorResponseDTO viewPerfil(@PathVariable long id) {
        return professorService.viewPerfil(id);
    }

    @Get
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<ProfessorResponseDTO> lista() {
        return professorService.lista();
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    @Secured(SecurityRule.IS_ANONYMOUS)
    public void delete(@PathVariable long id) {
        professorService.delete(id);
    }

    @Post("/{id}/distribuir_moedas") // app.js 360
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Transacao distribuirMoedas(@PathVariable Long id, @Body TransacaoRequest request) {
        return professorService.distribuirMoedas(id, request);
    }

    @Get("/{id}/extrato") // app.js 342 e 399
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<Transacao> getExtrato(@PathVariable Long id) {
        return transacaoRepository.findByProfessorIdOrderByDataHoraDesc(id);
    }

    @Post("/adicionar-moedas-semestrais")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Map<String, String> adicionarMoedasSemestrais() {
        professorService.adicionarMoedasSemestrais();
        return Map.of("message", "Moedas semestrais adicionadas a todos os professores");
    }
}