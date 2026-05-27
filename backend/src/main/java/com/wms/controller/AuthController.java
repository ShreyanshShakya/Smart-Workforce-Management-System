package com.wms.controller;

import com.wms.dto.AuthResponseDTO;
import com.wms.dto.LoginRequestDTO;
import com.wms.dto.RegisterRequestDTO;
import com.wms.dto.RefreshTokenRequestDTO;
import com.wms.dto.UserResponseDTO;
import com.wms.service.AuthService;
import com.wms.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")

    public AuthResponseDTO login(
            @Valid @RequestBody LoginRequestDTO requestDTO
    ) {

        return authService.login(requestDTO);
    }

    @PostMapping("/register")
    public UserResponseDTO register(
            @Valid @RequestBody RegisterRequestDTO requestDTO
    ) {
        return authService.register(requestDTO);
    }

    @PostMapping("/refresh")
    public AuthResponseDTO refresh(
            @Valid @RequestBody RefreshTokenRequestDTO requestDTO
    ) {
        return authService.refreshToken(requestDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @Valid @RequestBody RefreshTokenRequestDTO requestDTO
    ) {
        refreshTokenService.deleteByToken(requestDTO.getRefreshToken());
        return ResponseEntity.ok("Logged out successfully");
    }
}