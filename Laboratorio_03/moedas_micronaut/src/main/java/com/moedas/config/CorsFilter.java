package com.moedas.config;

import java.util.Arrays;
import java.util.List;

import org.reactivestreams.Publisher;

import io.micronaut.http.HttpMethod;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import jakarta.inject.Singleton;
import reactor.core.publisher.Flux;

@Singleton
@Filter("/**")
public class CorsFilter implements HttpServerFilter {

    // Lista de origens permitidas (similar ao Spring Boot)
    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
            "https://laboratoriodesenvolvimentosoftware.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5500"
    );

    private static final List<String> ALLOWED_METHODS = Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
    );

    private static final List<String> ALLOWED_HEADERS = Arrays.asList(
            "Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"
    );

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        String origin = request.getHeaders().get("Origin");
        String allowedOrigin = getAllowedOrigin(origin);
        
        // Intercepta requisições OPTIONS (preflight) - SEMPRE retorna 200 OK
        // Isso é crítico para que o preflight funcione
        if (request.getMethod() == HttpMethod.OPTIONS) {
            // Se a origem for permitida, usa ela, senão usa "*" para OPTIONS
            String corsOrigin = allowedOrigin != null ? allowedOrigin : "*";
            MutableHttpResponse<?> response = HttpResponse.ok()
                    .header("Access-Control-Allow-Origin", corsOrigin)
                    .header("Access-Control-Allow-Methods", String.join(", ", ALLOWED_METHODS))
                    .header("Access-Control-Allow-Headers", String.join(", ", ALLOWED_HEADERS))
                    .header("Access-Control-Allow-Credentials", "true")
                    .header("Access-Control-Max-Age", "3600");
            return Flux.just(response);
        }
        
        // Para outras requisições, processa normalmente e adiciona headers CORS
        return Flux.from(chain.proceed(request))
                .map(response -> {
                    // Só adiciona headers CORS se a origem for permitida
                    if (allowedOrigin != null) {
                        response.getHeaders().add("Access-Control-Allow-Origin", allowedOrigin);
                        response.getHeaders().add("Access-Control-Allow-Methods", String.join(", ", ALLOWED_METHODS));
                        response.getHeaders().add("Access-Control-Allow-Headers", String.join(", ", ALLOWED_HEADERS));
                        response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                    }
                    return response;
                });
    }
    
    private String getAllowedOrigin(String origin) {
        if (origin == null || origin.isEmpty()) {
            return null;
        }
        
        // Remove trailing slash para comparação
        String normalizedOrigin = origin.endsWith("/") ? origin.substring(0, origin.length() - 1) : origin;
        
        // Verifica se a origem está na lista de permitidas
        for (String allowed : ALLOWED_ORIGINS) {
            if (normalizedOrigin.equals(allowed) || normalizedOrigin.startsWith(allowed)) {
                return origin; // Retorna a origem original (com ou sem barra)
            }
        }
        
        return null; // Origem não permitida
    }
}