package com.wms.controller;

import com.wms.dto.TaskRequestDTO;
import com.wms.dto.TaskResponseDTO;
import com.wms.dto.TaskStatusUpdateDTO;
import com.wms.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")

public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping

    public TaskResponseDTO createTask(
            @Valid @RequestBody TaskRequestDTO requestDTO,
            Authentication authentication
    ) {

        String creatorEmail = authentication.getName();

        return taskService.createTask(
                requestDTO,
                creatorEmail
        );
    }

    @GetMapping("/my-tasks")

    public List<TaskResponseDTO> getMyTasks(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return taskService.getTasksForUser(email);
    }

    @PutMapping("/{taskId}/status")

    public TaskResponseDTO updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDTO requestDTO,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return taskService.updateTaskStatus(
                taskId,
                requestDTO,
                email
        );
    }
}