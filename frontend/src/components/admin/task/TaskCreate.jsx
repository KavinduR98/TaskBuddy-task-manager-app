import React, { useEffect, useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import memberService from "../../../services/memberService";
import LoadingSpinner from "../../common/LoadingSpinner";
import taskService from "../../../services/taskService";

const TaskCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
        userIds: [],
    });

    const [checklistItems, setChecklistItems] = useState([
        { id: 1, text: "", completed: false }
    ]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setUserLoading(true);
            const userData = await memberService.getAllUsers();
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users");
        } finally {
            setUserLoading(false);
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

    const handleUserSelection = (userId) => {
        setFormData((prev) => ({
        ...prev,
        userIds: prev.userIds.includes(userId)
            ? prev.userIds.filter((id) => id !== userId)
            : [...prev.userIds, userId],
        }));
    };

    // Checklist handlers
    const addChecklistItem = () => {
        const newId = checklistItems.length > 0 
                    ? Math.max(...checklistItems.map(item => item.id)) + 1 
                    : 1;
        setChecklistItems(prev => [
            ...prev,
            { id: newId, text: "", completed: false }
        ]);
    };

    const removeChecklistItem = (id) => {
        setChecklistItems(prev => prev.filter(item => item.id !== id));
    };

    const handleChecklistChange = (id, value) => {
        setChecklistItems(prev => 
            prev.map(item => 
                item.id === id ? { ...item, text: value } : item
            )
        );
    };

    const validateForm = () => {
        const errors = {};
        const {title, description, status, priority, dueDate} = formData;
        
        if (!title.trim()) {
            errors.title = 'Title is required';
        } else if (title.length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        
        if (!description.trim()) {
            errors.description = 'Description is required';
        } else if (description.length > 1000) {
            errors.description = 'Description must not exceed 1000 characters';
        }

        if (!status) {
            errors.status = 'Status is required';
        }

        if (!priority) {
            errors.priority = 'Priority is required';
        }

        if (!dueDate) {
            errors.dueDate = 'Due date is required';
        } else {
            const today = new Date().toISOString().split('T')[0];
            if (dueDate < today) {
                errors.dueDate = 'Due date must be in the future';
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

            // Filter out empty checklist items and remove the id field
            const validChecklistItems = checklistItems
                .filter(item => item.text.trim() !== "")
                .map(item => ({
                    text: item.text,
                    completed: item.completed
                }));

            const taskData = {
                ...formData,
                userIds:
                formData.userIds.length > 0 ? formData.userIds : [],
                checklistItems: validChecklistItems
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

    if (userLoading) {
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

                            {/* TODO Checklist */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    TODO Checklist
                                </label>
                                <div className="space-y-2">
                                    {checklistItems.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={item.text}
                                                onChange={(e) => handleChecklistChange(item.id, e.target.value)}
                                                placeholder={`Checklist item ${index + 1}`}
                                                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-indigo-500"
                                            />
                                            {checklistItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeChecklistItem(item.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-gray-500">
                                        {checklistItems.filter(item => item.text.trim() !== "").length} checklist item(s)
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addChecklistItem}
                                        className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors text-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add more
                                    </button>
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

                        {/* Right side - Assign members */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Members
                            </label>
                            <div className="border border-gray-300 rounded-md p-3 max-h-72 overflow-y-auto">
                                {users.length === 0 ? (
                                <p className="text-gray-500 text-sm">
                                    No active members available
                                </p>
                                ) : (
                                <div className="space-y-2">
                                    {users.map((user) => (
                                    <label key={user.id} className="flex items-center">
                                        <input
                                        type="checkbox"
                                        checked={formData.userIds.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                        {user.fullName} - {user.email}
                                        </span>
                                    </label>
                                    ))}
                                </div>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.userIds.length} member(s) selected
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
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