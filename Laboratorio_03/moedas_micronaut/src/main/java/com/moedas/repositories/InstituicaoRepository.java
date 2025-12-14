package com.moedas.repositories;

import com.moedas.entities.Instituicao;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {
}
