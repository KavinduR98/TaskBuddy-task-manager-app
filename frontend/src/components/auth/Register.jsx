import { UserPlus, Mail, Lock } from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom';
import React, { useState } from 'react'
import loginImage from '../../assets/login-bg.jpg';
import LoadingSpinner from '../common/LoadingSpinner';
import authService from '../../services/authService';

const Register = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.register(formData);
            console.log(response);
            
            navigate('/');
        } catch (error) {
            setError(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    if (loading) {
        return <LoadingSpinner />
    }

  return (
    <div className='flex min-h-screen'>
        {/* Left side */}
        <div className='flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 bg-gray-50'>
            <div className='max-w-md w-full mx-auto space-y-8'>
                {/* App name / Logo */}
                <div>
                    <h1 className='text-4xl font-extrabold text-gray-900'>Task Manager</h1>
                    <p className='mt-2 text-gray-600'>Create your account</p>
                </div>

                <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    This registration is intended for current company members.
                </div>

                {/* Form */}
                <form className='space-y-6' onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className='space-y-4'>
                        {/* Full name */}
                        <div>
                            <label htmlFor="fullName" className='block text-sm font-medium text-gray-700'>
                                Full Name
                            </label>
                            <div className='mt-1 relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <UserPlus className='h-5 w-5 text-gray-400'/>
                                </div>
                                <input 
                                    type="text" 
                                    id='fullName'
                                    name='fullName'
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className='appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500
                                    text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                    placeholder='Enter your full name' 
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 
                                    placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                                    focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 
                                    placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 
                                    focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Register Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
                            font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 text-center">
                        Already have an account?{" "}
                        <Link to="/" className="text-indigo-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>

        {/* Right side */}
        <div className='hidden lg:block w-1/2'>
            <img src={loginImage} alt='Background Image' className='h-full w-full object-cover'/>
        </div>
    </div>
  )
}

export default Register