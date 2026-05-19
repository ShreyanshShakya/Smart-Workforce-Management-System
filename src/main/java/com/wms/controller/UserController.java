package com.wms.controller;

import com.wms.dto.UserRequestDTO;
import com.wms.dto.UserResponseDTO;
import com.wms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody UserRequestDTO requestDTO) {

        return userService.createUser(requestDTO);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {

        return userService.getAllUsers();
    }
    @GetMapping("/protected")

    public String protectedRoute() {

        return "Access granted to protected route";
    }
}