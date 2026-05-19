package com.wms.dto;

import com.wms.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class UserResponseDTO {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private LocalDateTime createdAt;
}