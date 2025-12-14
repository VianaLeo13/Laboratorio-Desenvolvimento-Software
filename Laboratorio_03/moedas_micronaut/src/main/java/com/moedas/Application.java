package com.moedas;

import io.micronaut.runtime.Micronaut;

public class Application {

    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
        System.err.println("🚀 Sistema de Moedas Virtuais iniciado com sucesso!");
    }
}