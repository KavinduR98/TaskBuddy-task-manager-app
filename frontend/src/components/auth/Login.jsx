import { Lock, LogIn, Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link  } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import loginImage from '../../assets/login-bg.jpg';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await login(credentials);
            toast.success('Login successful! Redirecting...');
        } catch (error) {
            const errorMessage = error.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });

        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const { email, password } = credentials;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }

        if (!password) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side */}
            <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 bg-gray-50">
                <div className="max-w-md w-full mx-auto space-y-8">
                {/* Logo / App Name */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Task Manager
                    </h1>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                            Email
                            </label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                value={credentials.email}
                                onChange={handleChange}
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 
                                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                                focus:border-indigo-500 sm:text-sm ${
                                        validationErrors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter your email"
                            />
                            </div>
                            {validationErrors.email && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                            Password
                            </label>
                            <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={credentials.password}
                                onChange={handleChange}
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 
                                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                                focus:border-indigo-500 sm:text-sm ${
                                        validationErrors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter your password"
                            />
                            </div>
                            {validationErrors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sign in Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
                            font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                            </span>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>

                    {/* Link to Register */}
                    <p className="text-sm text-gray-600 text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Create one
                    </Link>
                    </p>
                </form>
                </div>
            </div>

            {/* Right Side Image */}
            <div className="hidden lg:block w-1/2">
                <img
                    src={loginImage}
                    alt="Background"
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
};

export default Login;
