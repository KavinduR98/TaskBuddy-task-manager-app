import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import employeeService from "../../services/employeeService";
import LoadingSpinner from "../common/LoadingSpinner";
import taskService from "../../services/taskService";

const TaskCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
        employeeIds: [],
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setEmployeeLoading(true);
            const response = await employeeService.getAllEmployees();

            // Filter only active employees
            const activeEmployees = response.filter((emp) => emp.status === "ACTIVE");
            setEmployees(activeEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to load employees");
        } finally {
            setEmployeeLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
        setValidationErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        }
    };

    const handleEmployeeSelection = (employeeId) => {
        setFormData((prev) => ({
        ...prev,
        employeeIds: prev.employeeIds.includes(employeeId)
            ? prev.employeeIds.filter((id) => id !== employeeId)
            : [...prev.employeeIds, employeeId],
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) { // Checks if title is empty or just whitespace
            errors.title = "Title is required";
        } else if (formData.title.length < 3) {
            errors.title = "Title must be at least 3 characters";
        }

        if (formData.description && formData.description.length > 1000) {
            errors.description = "Description must not exceed 1000 characters";
        }

        if (formData.dueDate) {
            const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
            if (formData.dueDate < today) {
                // Compare input date with today's date
                errors.dueDate = "Due date must be in the future";
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCancel = () => {
        navigate("/admin/tasks");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
        return;
        }

        try {
        setLoading(true);
        setError("");

        const taskData = {
            ...formData,
            employeeIds:
            formData.employeeIds.length > 0 ? formData.employeeIds : [],
        };

        await taskService.createTask(taskData);
            navigate("/admin/tasks");
        } catch (error) {
            console.error("Error creating task:", error);
        if (error.response?.data?.validationErrors) {
            setValidationErrors(error.response.data.validationErrors);
        } else {
            setError(error.response?.data?.message || "Failed to create task");
        }
        } finally {
        setLoading(false);
        }
    };

    if (employeeLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="max-w-8xl mx-auto">
                <h1 className="text-lg font-bold text-gray-900 mb-4">
                    Create New Task
                </h1>

                {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
                    {error}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left side */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter task title"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.title ? "border-red-500" : "border-gray-300"
                                    }`} 
                                />
                                {validationErrors.title && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.title}
                                </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter task description"
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.description ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                <p className="text-sm text-gray-500">
                                    {formData.description.length}/1000 characters
                                </p>
                                {validationErrors.description && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.description}
                                </p>
                                )}
                            </div>

                            {/* Status & Priority */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                                </div>
                                <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Priority *
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label
                                    htmlFor="dueDate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500 ${
                                        validationErrors.dueDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                />
                                {validationErrors.dueDate && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.dueDate}
                                </p>
                                )}
                            </div>
                        </div>

                        {/* Right side - Assign employees */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Employees
                            </label>
                            <div className="border border-gray-300 rounded-md p-3 max-h-72 overflow-y-auto">
                                {employees.length === 0 ? (
                                <p className="text-gray-500 text-sm">
                                    No active employees available
                                </p>
                                ) : (
                                <div className="space-y-2">
                                    {employees.map((emp) => (
                                    <label key={emp.id} className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={formData.employeeIds.includes(emp.id)}
                                        onChange={() => handleEmployeeSelection(emp.id)}
                                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                        {emp.name} - {emp.department} - {emp.position}
                                        </span>
                                    </label>
                                    ))}
                                </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.employeeIds.length} employee(s) selected
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskCreate;