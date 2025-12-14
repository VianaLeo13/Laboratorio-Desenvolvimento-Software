package com.moedas.controllers;

import com.moedas.dto.response.AuthResponse;
import com.moedas.dto.request.LoginRequest;
import com.moedas.services.AuthService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import lombok.RequiredArgsConstructor;

@Controller("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Post("/login")
    @Secured(SecurityRule.IS_ANONYMOUS)
    public AuthResponse login(@Body LoginRequest request) {
        return authService.login(request);
    }
}