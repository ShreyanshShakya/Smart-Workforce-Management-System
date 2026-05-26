import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import MyTasksPage from "./pages/MyTasksPage";
import UsersPage from "./pages/UsersPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route element={<DashboardLayout />}>
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/tasks" 
                            element={
                                <ProtectedRoute roles={['ADMIN', 'MANAGER']}>
                                    <TasksPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/my-tasks" 
                            element={
                                <ProtectedRoute>
                                    <MyTasksPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/users" 
                            element={
                                <ProtectedRoute roles={['ADMIN', 'MANAGER']}>
                                    <UsersPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);