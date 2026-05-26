package com.wms.controller;

import com.wms.dto.TaskRequestDTO;
import com.wms.dto.TaskResponseDTO;
import com.wms.dto.TaskStatusUpdateDTO;
import com.wms.dto.TaskAnalyticsDTO;
import com.wms.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.wms.entity.TaskPriority;
import com.wms.entity.TaskStatus;
import org.springframework.data.domain.Page;
import io.swagger.v3.oas.annotations.Operation;

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

    @GetMapping("/status/{status}")

    public List<TaskResponseDTO> getTasksByStatus(
            @PathVariable TaskStatus status
    ) {

        return taskService.getTasksByStatus(status);
    }

    @GetMapping("/priority/{priority}")

    public List<TaskResponseDTO> getTasksByPriority(
            @PathVariable TaskPriority priority
    ) {

        return taskService.getTasksByPriority(priority);
    }

    @GetMapping("/overdue")

    public List<TaskResponseDTO> getOverdueTasks() {

        return taskService.getOverdueTasks();
    }

    @GetMapping

    public Page<TaskResponseDTO> getAllTasks(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "deadline")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction
    ) {

        return taskService.getAllTasks(
                page,
                size,
                sortBy,
                direction
        );
    }

    @GetMapping("/analytics")
    public TaskAnalyticsDTO getAnalytics() {
        return taskService.getAnalytics();
    }

    @GetMapping("/analytics/me")
    public TaskAnalyticsDTO getMyAnalytics(Authentication authentication) {
        String email = authentication.getName();
        return taskService.getMyAnalytics(email);
    }
}