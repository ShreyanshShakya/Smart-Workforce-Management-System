package com.wms.service;

import com.wms.dto.TaskRequestDTO;
import com.wms.dto.TaskResponseDTO;
import com.wms.entity.Task;
import com.wms.entity.TaskStatus;
import com.wms.entity.User;
import com.wms.repository.TaskRepository;
import com.wms.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.wms.dto.TaskStatusUpdateDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository
    ) {

        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public TaskResponseDTO createTask(
            TaskRequestDTO requestDTO,
            String creatorEmail
    ) {

        User assignedUser = userRepository.findById(
                requestDTO.getAssignedToUserId()
        ).orElseThrow(() ->
                new RuntimeException("Assigned user not found")
        );

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() ->
                        new RuntimeException("Creator not found")
                );

        Task task = Task.builder()
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .priority(requestDTO.getPriority())
                .status(TaskStatus.PENDING)
                .deadline(requestDTO.getDeadline())
                .assignedTo(assignedUser)
                .createdBy(creator)
                .createdAt(LocalDateTime.now())
                .build();

        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    public List<TaskResponseDTO> getTasksForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return taskRepository.findByAssignedTo(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TaskResponseDTO mapToResponse(Task task) {

        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .deadline(task.getDeadline())
                .assignedTo(task.getAssignedTo().getEmail())
                .createdBy(task.getCreatedBy().getEmail())
                .createdAt(task.getCreatedAt())
                .build();
    }

    public TaskResponseDTO updateTaskStatus(
            Long taskId,
            TaskStatusUpdateDTO requestDTO,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Task task = taskRepository.findByIdAndAssignedTo(
                taskId,
                user
        ).orElseThrow(() ->
                new RuntimeException(
                        "Task not found or access denied"
                )
        );

        task.setStatus(requestDTO.getStatus());

        Task updatedTask = taskRepository.save(task);

        return mapToResponse(updatedTask);
    }
}