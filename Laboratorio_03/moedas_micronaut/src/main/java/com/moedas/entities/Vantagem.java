package com.moedas.entities;

import io.micronaut.data.annotation.MappedProperty;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity(name = "vantagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Serdeable
public class Vantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String descricao;

    private String fotoUrl;

    private double custoMoedas;

    @MappedProperty
    @Column(name = "random_code", unique = true, nullable = false, updatable = false)
    private String randomCode;

    @MappedProperty
    @Lob
    @Column(name = "qr_code_base64", columnDefinition = "TEXT")
    private String qrCodeBase64;

    private boolean ativa;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @PrePersist
    public void ensureRandomCode() {
        if (this.randomCode == null || this.randomCode.isBlank()) {
            this.randomCode = generateRandomCode();
        }
    }

    private String generateRandomCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
