package com.moedas.repositories;

import com.moedas.entities.Transacao;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByAlunoIdOrderByDataHoraDesc(Long alunoId);
    List<Transacao> findByProfessorIdOrderByDataHoraDesc(Long professorId);
}