package com.moedas.controllers;

import com.moedas.dto.request.CreateAlunoRequestDTO;
import com.moedas.dto.request.UpdateAlunoRequestDTO;
import com.moedas.dto.response.CreateAlunoResponseDTO;
import com.moedas.entities.Aluno;
import com.moedas.entities.Transacao;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.TransacaoRepository;
import com.moedas.services.aluno.AlunoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Controller("/alunos")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class AlunoController {
    private final TransacaoRepository transacaoRepository;
    private final AlunoRepository alunoRepository;
    private final AlunoService alunoService;

    @Post("/cadastrar")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> cadastrarAluno(@Body CreateAlunoRequestDTO createAlunoRequestDTO) {
        try {
            CreateAlunoResponseDTO response = alunoService
                    .create(createAlunoRequestDTO);
            return HttpResponse.ok(response);
        } catch (IllegalArgumentException e) {
            return HttpResponse.badRequest(e.getMessage());
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Put("/update/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> atualizarAluno(@Body UpdateAlunoRequestDTO updateAlunoRequestDTO, @PathVariable long id) {
        try{
            System.out.println(id);
            return HttpResponse.ok(alunoService.update(updateAlunoRequestDTO, id));
        } catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> visualizarPerfil(@PathVariable long id) {
        try{
            return HttpResponse.ok(alunoService.viewPerfil(id));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Get("/all")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarAlunos() {
        try{
            return HttpResponse.ok(alunoService.lista());
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> deletarAluno(@PathVariable long id) {
        try {
            alunoService.delete(id);
            return HttpResponse.noContent();
        }catch (Exception e) {
            return HttpResponse.serverError("Erro interno no servidor");
        }
    }

    @Get("/{id}/extrato-transacoes") // 324 app.js
    @Secured(SecurityRule.IS_ANONYMOUS)
    public List<Transacao> getExtratoTransacoes(@PathVariable Long id) {
        return transacaoRepository.findByAlunoIdOrderByDataHoraDesc(id);
    }

    @Get("/{id}/saldo")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public Double getSaldo(@PathVariable Long id) {
        Aluno aluno = alunoRepository.findById(id).orElseThrow(() -> new RuntimeException("Error"));
        return aluno.getSaldoMoedas();
    }
}