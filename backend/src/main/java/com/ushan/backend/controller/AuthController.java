package com.ushan.backend.controller;

import com.ushan.backend.dto.request.LoginRequestDTO;
import com.ushan.backend.dto.request.UserRegistrationRequestDTO;
import com.ushan.backend.dto.response.LoginResponseDTO;
import com.ushan.backend.dto.response.RegistrationResponseDTO;
import com.ushan.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid
            @RequestBody LoginRequestDTO loginRequest
            ){
        log.info("POST /api/auth/login - Login attempt for user: {}", loginRequest.getEmail());
        LoginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDTO> register(
            @Valid
            @RequestBody UserRegistrationRequestDTO registrationRequest
            ){
        log.info("POST /api/auth/register - Registration attempt for user: {}", registrationRequest.getEmail());
        RegistrationResponseDTO response = authService.register(registrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
