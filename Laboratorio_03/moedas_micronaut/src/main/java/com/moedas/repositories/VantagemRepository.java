package com.moedas.repositories;

import com.moedas.entities.Vantagem;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

    List<Vantagem> findByAtivaTrue();

    List<Vantagem> findByEmpresaId(Long empresaId);

    // Novo método: buscar vantagens por aluno

}