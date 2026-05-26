package com.wms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskAnalyticsDTO {
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private long pendingTasks;
}
