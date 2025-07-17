package com.ushan.backend.service;

import com.ushan.backend.config.JwtTokenUtil;
import com.ushan.backend.dto.request.LoginRequestDTO;
import com.ushan.backend.dto.response.LoginResponseDTO;
import com.ushan.backend.entity.User;
import com.ushan.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.Date;

@Service
@Slf4j
@Transactional
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest){
        log.info("Attempting to authenticate user: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtTokenUtil.generateToken(user.getUsername(), user.getRole());
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);

        log.info("User authenticated successfully: {}", user.getUsername());

        return LoginResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresAt(expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();
    }

}
