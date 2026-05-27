package com.wms.controller;

import com.wms.dto.AuthResponseDTO;
import com.wms.dto.LoginRequestDTO;
import com.wms.dto.RegisterRequestDTO;
import com.wms.dto.RefreshTokenRequestDTO;
import com.wms.dto.UserResponseDTO;
import com.wms.service.AuthService;
import com.wms.service.RefreshTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO requestDTO
    ) {
        AuthResponseDTO responseDTO = authService.login(requestDTO);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", responseDTO.getRefreshToken())
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .path("/api/auth")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Strict")
                .build();
                
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseDTO);
    }

    @PostMapping("/register")
    public UserResponseDTO register(
            @Valid @RequestBody RegisterRequestDTO requestDTO
    ) {
        return authService.register(requestDTO);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(
            @CookieValue(name = "refreshToken") String refreshToken
    ) {
        RefreshTokenRequestDTO requestDTO = new RefreshTokenRequestDTO(refreshToken);
        AuthResponseDTO responseDTO = authService.refreshToken(requestDTO);
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", responseDTO.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/api/auth")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Strict")
                .build();
                
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        if (refreshToken != null) {
            refreshTokenService.deleteByToken(refreshToken);
        }
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("Strict")
                .build();
                
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}