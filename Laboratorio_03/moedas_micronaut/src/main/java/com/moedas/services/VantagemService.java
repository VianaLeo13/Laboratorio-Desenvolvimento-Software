package com.moedas.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.moedas.dto.request.VantagemRequest;
import com.moedas.entities.Aluno;
import com.moedas.entities.Empresa;
import com.moedas.entities.UsarVantagem;
import com.moedas.entities.Vantagem;
import com.moedas.repositories.AlunoRepository;
import com.moedas.repositories.EmpresaRepository;
import com.moedas.repositories.UsarVantagemRepository;
import com.moedas.repositories.VantagemRepository;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.Base64;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
@RequiredArgsConstructor
@Slf4j
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final UsarVantagemRepository usarVantagemRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaRepository empresaRepository;

    public Vantagem criarVantagem(Long empresaId, VantagemRequest request) {
        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));

        Vantagem vantagem = Vantagem.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .fotoUrl(request.getFotoUrl())
                .custoMoedas(request.getCustoMoedas())
                .empresa(empresa)
                .ativa(true)
                .build();

        vantagem = vantagemRepository.save(vantagem);

        log.info("Vantagem {} criada pela empresa {}", vantagem.getNome(), empresa.getRazaoSocial());

        return vantagem;
    }

    public Vantagem getVantagem(Long id) {
        return vantagemRepository.findById(id).orElseThrow(() -> new RuntimeException("not found"));
    }

    public List<Vantagem> listarVantagensAtivas() {
        return vantagemRepository.findByAtivaTrue();
    }

    public List<Vantagem> listarVantagensPorEmpresa(Long empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId);
    }

    // NOVO MÉTODO: Listar vantagens por aluno
    public List<Vantagem> listarVantagensPorAluno(Long alunoId) {
        List<UsarVantagem> listaUsarVantagem = usarVantagemRepository.findByAlunoId(alunoId);

        List<Vantagem> listaVantagens = listaUsarVantagem.stream()
                        .map(UsarVantagem::getVantagem)
                        .collect(Collectors.toList());

        return listaUsarVantagem.stream()
                .map(UsarVantagem::getVantagem)
                .distinct()
                .collect(Collectors.toList());
    }

 //    NOVO MÉTODO: Resgatar vantagem (associar a um aluno)
    public Vantagem resgatarVantagem(Long vantagemId, Long alunoId, String urlVantagem) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.isAtiva()) {
            throw new RuntimeException("Vantagem não está ativa");
        }

        Aluno aluno = alunoRepository.findById(alunoId).orElseThrow(() -> new RuntimeException("Nenhum aluno encontrado"));

        if(aluno.getSaldoMoedas() < vantagem.getCustoMoedas()){
            throw new RuntimeException("Moedas insuficientes");
        }

        vantagem.setQrCodeBase64(this.gerarQrBase64(urlVantagem));
        vantagemRepository.update(vantagem);

        UsarVantagem usarVantagem = UsarVantagem.builder()
                .vantagem(vantagem)
                .aluno(aluno)
                .build();

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.update(aluno);
        usarVantagem = usarVantagemRepository.save(usarVantagem);

        log.info("Vantagem {} resgatada pelo aluno {}", vantagem.getNome(), alunoId);

        return vantagem;
    }

    public void deletarVantagem(Long vantagemId, Long empresaId) {
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada"));

        if (!vantagem.getEmpresa().getId().equals(empresaId)) {
            throw new RuntimeException("Vantagem não pertence a esta empresa");
        }

        vantagemRepository.delete(vantagem);
        log.info("Vantagem {} deletada pela empresa {}", vantagem.getNome(), empresaId);
    }

    public String gerarQrBase64(String texto) {
        try {
            var writer = new MultiFormatWriter();
            var matrix = writer.encode(texto, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);

            return Base64.getEncoder().encodeToString(out.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar QR Code", e);
        }
    }
}