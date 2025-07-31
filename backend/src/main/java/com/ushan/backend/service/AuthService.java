package com.ushan.backend.service;

import com.ushan.backend.config.JwtTokenUtil;
import com.ushan.backend.dto.request.LoginRequestDTO;
import com.ushan.backend.dto.request.UserRegistrationRequestDTO;
import com.ushan.backend.dto.response.LoginResponseDTO;
import com.ushan.backend.dto.response.RegistrationResponseDTO;
import com.ushan.backend.entity.User;
import com.ushan.backend.exception.EmailAlreadyExistsException;
import com.ushan.backend.repository.UserRepository;
import com.ushan.backend.util.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest){
        log.info("Attempting to authenticate user: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole());
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken(token);

        log.info("User authenticated successfully: {}", user.getEmail());

        return LoginResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresAt(expirationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();
    }

    public RegistrationResponseDTO register(UserRegistrationRequestDTO registrationRequest){
        log.info("Attempting registration for email: {}", registrationRequest.getEmail());

        // Check if user is already exists
        if (userRepository.findByEmail(registrationRequest.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException("Email already exists");
        }

        // Create a new User
        User newUser = User.builder()
                .fullName(registrationRequest.getFullName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .role(Role.MEMBER)
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("User registered successfully: {}", savedUser.getEmail());

        return RegistrationResponseDTO.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

}
