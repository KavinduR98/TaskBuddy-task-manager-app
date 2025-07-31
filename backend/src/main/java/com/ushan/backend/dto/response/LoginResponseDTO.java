package com.ushan.backend.dto.response;

import com.ushan.backend.util.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDTO {
    private String token;
    private String type = "Bearer";
    private String fullName;
    private String email;
    private Role role;
    private LocalDateTime expiresAt;
}
