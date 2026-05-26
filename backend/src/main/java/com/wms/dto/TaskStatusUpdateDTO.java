package com.wms.dto;

import com.wms.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class TaskStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}