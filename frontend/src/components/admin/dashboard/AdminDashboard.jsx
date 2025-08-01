import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { STATUS_COLORS } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import taskService from "../../../services/taskService";
import LoadingSpinner from "../../common/LoadingSpinner";
import RecentTaskTable from "./RecentTaskTable";
import CardSection from "./CardSection";
import StatCard from "./StatCard";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Import utility functions and chart options
import {getTaskDistributionData, getTaskPriorityData} from '../../../utils/chartDataUtils';
import {pieChartOptions, barChartOptions} from '../../../utils/chartOptions';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const taskData = await taskService.getAllTasks();
            setTasks(taskData);
        } catch (error) {
            setError(error.message || "Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const currentHour = today.getHours();
    const greeting =
        currentHour < 12
            ? "Good Morning"
            : currentHour < 18
            ? "Good Afternoon"
            : "Good Evening";

    const taskStats = taskService.getTaskStats(tasks);

    // Get the latest 10 tasks sorted by creation date
    const getRecentTasks = () => {
        return tasks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
            .slice(0, 10) // Take only the first 10
    };

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading tasks..." />;
    }

    return (
        <div>
            <div className="bg-white rounded-lg shadow p-4 mb-2">
                {/* Greeting and Date */}
                <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {greeting}! {user.fullName || "user"}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">{formattedDate}</p>
                </div>

                {/* Tasks Stats */}
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                        label="Total Tasks"
                        value={taskStats.total}
                        bg="bg-gray-100 text-gray-800"
                        />
                        <StatCard
                        label="Pending Tasks"
                        value={taskStats.PENDING}
                        bg={STATUS_COLORS.PENDING}
                        />
                        <StatCard
                        label="In Progress"
                        value={taskStats.IN_PROGRESS}
                        bg={STATUS_COLORS.IN_PROGRESS}
                        />
                        <StatCard
                        label="Completed Tasks"
                        value={taskStats.COMPLETED}
                        bg={STATUS_COLORS.COMPLETED}
                        />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 mb-2">
                <CardSection title="Task Distribution">
                    <div style={{ height: '300px', padding: '10px' }}>
                        <Pie data={getTaskDistributionData(taskStats)} options={pieChartOptions} />
                    </div>
                </CardSection>
                <CardSection title="Task Priority Levels">
                    <div style={{ height: '300px', padding: '10px' }}>
                        <Bar data={getTaskPriorityData(tasks)} options={barChartOptions}/>
                    </div>
                </CardSection>
            </div>

            {/* Recent tasks */}
            <div className="bg-white rounded-lg shadow p-2">
                <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-800 m-2">
                    Recent Tasks
                </h4>
                <button
                    onClick={() => navigate("/admin/tasks")}
                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 rounded-md py-2 flex items-center transition-colors text-sm"
                >
                    See All
                    <ArrowRight className="w-6 h-4" />
                </button>
                </div>

                <div>
                    <RecentTaskTable tasks={getRecentTasks()} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
