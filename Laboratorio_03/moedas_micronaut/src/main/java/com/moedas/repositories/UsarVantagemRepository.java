package com.moedas.repositories;

import com.moedas.entities.UsarVantagem;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface UsarVantagemRepository extends JpaRepository<UsarVantagem, Long> {
    List<UsarVantagem> findByAlunoId(Long alunoId);
}
