package com.moedas.controllers;

import java.util.List;

import com.moedas.dto.request.VantagemRequest;
import com.moedas.services.VantagemService;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

@Controller("/vantagem")
@RequiredArgsConstructor
public class VantagemController {

    private final VantagemService vantagemService;

    @Post("{idEmpresa}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> createVantagem(@PathVariable Long idEmpresa, @Body VantagemRequest vantagemRequest) {
        try {
            return HttpResponse.created(vantagemService.criarVantagem(idEmpresa, vantagemRequest));
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> getVantagem(@PathVariable Long id) {
        return HttpResponse.ok(vantagemService.getVantagem(id));
    }

    // NOVO ENDPOINT: Listar vantagens por aluno
    @Get("/aluno/{alunoId}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensPorAluno(@PathVariable Long alunoId) {
        try {
            List<?> vantagens = vantagemService.listarVantagensPorAluno(alunoId);
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // NOVO ENDPOINT: Resgatar vantagem
    @Post("/resgatar/{vantagemId}/aluno/{alunoId}/{urlVantagem}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> resgatarVantagem(@PathVariable Long vantagemId, @PathVariable Long alunoId, @QueryValue String urlVantagem) {
        try {
            return HttpResponse.ok(vantagemService.resgatarVantagem(vantagemId, alunoId, urlVantagem));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    // Endpoint para listar vantagens por empresa
    @Get("/empresa/{empresaId}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensPorEmpresa(@PathVariable Long empresaId) {
        try {
            List<?> vantagens = vantagemService.listarVantagensPorEmpresa(empresaId);
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }

    // Endpoint para listar todas as vantagens ativas
    @Get("/ativas")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarVantagensAtivas() {
        try {
            List<?> vantagens = vantagemService.listarVantagensAtivas();
            return HttpResponse.ok(vantagens);
        } catch (Exception e) {
            return HttpResponse.serverError();
        }
    }
}