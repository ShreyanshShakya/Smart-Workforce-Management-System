package com.wms.controller;

import com.wms.dto.AuthResponseDTO;
import com.wms.dto.LoginRequestDTO;
import com.wms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")

    public AuthResponseDTO login(
            @Valid @RequestBody LoginRequestDTO requestDTO
    ) {

        return authService.login(requestDTO);
    }
}