import api from "../api/axios";

export const getAllUsers = async () => {

    const response = await api.get(
        "/users"
    );

    return response.data;
};