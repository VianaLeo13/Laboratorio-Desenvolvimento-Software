package com.moedas.controllers;

import com.moedas.dto.request.CreateEmpresaRequestDTO;
import com.moedas.dto.request.UpdateEmpresaRequestDTO;
import com.moedas.dto.request.VantagemRequest;
import com.moedas.entities.Empresa;
import com.moedas.entities.Vantagem;
import com.moedas.repositories.EmpresaRepository;
import com.moedas.repositories.VantagemRepository;
import com.moedas.services.empresa.EmpresaService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@Controller("/empresas")
@Secured(SecurityRule.IS_AUTHENTICATED)
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @Post("/create")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> createEmpresa(@Body CreateEmpresaRequestDTO createEmpresaRequestDTO) {
        try{
            return HttpResponse.ok(empresaService.createEmpresa(createEmpresaRequestDTO));
        }catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Put("/update/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> updateEmpresa(@Body UpdateEmpresaRequestDTO updateEmpresaRequestDTO, @PathVariable Long id) {
        try{
            return HttpResponse.ok(empresaService.updateEmpresa(updateEmpresaRequestDTO, id));
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Get("/all")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> listarAlunos() {
        try{
            return HttpResponse.ok(empresaService.lista());
        } catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Get("/view/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<?> viewEmpresa(@PathVariable Long id){
        try{
            return HttpResponse.ok(empresaService.viewEmpresa(id));
        }catch (Exception e) {
            return HttpResponse.badRequest(e.getMessage());
        }
    }

    @Delete("/{id}")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public HttpResponse<Void> deleteEmpresa(@PathVariable Long id){
            empresaService.deletaEmpresa(id);
        return HttpResponse.noContent();
    }
}