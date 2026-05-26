package com.wms.repository;

import com.wms.entity.Task;
import com.wms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.wms.entity.TaskPriority;
import com.wms.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

import java.util.List;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(User user);

    Optional<Task> findByIdAndAssignedTo(
            Long id,
            User user
    );

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByPriority(TaskPriority priority);

    List<Task> findByDeadlineBefore(LocalDate date);

    Page<Task> findAll(Pageable pageable);
}

