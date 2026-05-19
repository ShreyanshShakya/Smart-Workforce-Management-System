package com.wms.repository;

import com.wms.entity.Task;
import com.wms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(User user);

    Optional<Task> findByIdAndAssignedTo(
            Long id,
            User user
    );
}

