package com.wms.service;

import com.wms.dto.TaskAnalyticsDTO;
import com.wms.entity.TaskStatus;
import com.wms.entity.User;
import com.wms.repository.TaskRepository;
import com.wms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAnalytics() {
        when(taskRepository.count()).thenReturn(10L);
        when(taskRepository.countByStatus(TaskStatus.COMPLETED)).thenReturn(4L);
        when(taskRepository.countByDeadlineBeforeAndStatusNot(any(LocalDate.class), eq(TaskStatus.COMPLETED))).thenReturn(2L);

        TaskAnalyticsDTO analytics = taskService.getAnalytics();

        assertEquals(10L, analytics.getTotalTasks());
        assertEquals(4L, analytics.getCompletedTasks());
        assertEquals(2L, analytics.getOverdueTasks());
        assertEquals(6L, analytics.getPendingTasks());
    }

    @Test
    void testGetMyAnalytics() {
        User user = new User();
        user.setEmail("employee@test.com");
        
        when(userRepository.findByEmail("employee@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.countByAssignedTo(user)).thenReturn(5L);
        when(taskRepository.countByAssignedToAndStatus(user, TaskStatus.COMPLETED)).thenReturn(1L);
        when(taskRepository.countByAssignedToAndDeadlineBeforeAndStatusNot(eq(user), any(LocalDate.class), eq(TaskStatus.COMPLETED))).thenReturn(1L);

        TaskAnalyticsDTO analytics = taskService.getMyAnalytics("employee@test.com");

        assertEquals(5L, analytics.getTotalTasks());
        assertEquals(1L, analytics.getCompletedTasks());
        assertEquals(1L, analytics.getOverdueTasks());
        assertEquals(4L, analytics.getPendingTasks());
    }
}
