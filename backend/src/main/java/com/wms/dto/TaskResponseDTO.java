package com.wms.dto;

import com.wms.entity.TaskPriority;
import com.wms.entity.TaskStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class TaskResponseDTO {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDate deadline;

    private String assignedTo;

    private String createdBy;

    private LocalDateTime createdAt;
}