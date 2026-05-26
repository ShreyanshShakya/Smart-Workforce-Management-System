import api from "../api/axios";

export const getMyTasks = async () => {

    const response = await api.get(
        "/tasks/my-tasks"
    );

    return response.data;
};

export const updateTaskStatus = async (
    taskId,
    status
) => {

    const response = await api.put(
        `/tasks/${taskId}/status`,
        {
            status,
        }
    );

    return response.data;
};

export const getOverdueTasks = async () => {

    const response = await api.get(
        "/tasks/overdue"
    );

    return response.data;
};

export const createTask = async (
    taskData
) => {

    const response = await api.post(
        "/tasks",
        taskData
    );

    return response.data;
};

export const getAllTasks = async (page = 0, size = 10, sortBy = 'deadline', direction = 'asc') => {
    const response = await api.get("/tasks", {
        params: {
            page,
            size,
            sortBy,
            direction
        }
    });
    return response.data;
};

export const getTasksByStatus = async (status) => {
    const response = await api.get(`/tasks/status/${status}`);
    return response.data;
};

export const getTasksByPriority = async (priority) => {
    const response = await api.get(`/tasks/priority/${priority}`);
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get("/tasks/analytics");
    return response.data;
};

export const getMyAnalytics = async () => {
    const response = await api.get("/tasks/analytics/me");
    return response.data;
};