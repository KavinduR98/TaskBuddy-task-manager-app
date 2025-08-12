import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => { 
		const initializeAuth = () => {
			try {
				const currentUser = authService.getCurrentUser();
				const isAuth = authService.isAuthenticated();

				// Only set user if token is still valid
				if (currentUser && isAuth) {
					setUser(currentUser);
				}else if(currentUser && !isAuth){
					// Clear expired session
					authService.logout();
					setUser(null);
				}
			} catch (error) {
				console.error('Auth intialization error:', error);
				authService.logout();
				setUser(null);
			} finally {
				setLoading(false);
			}
		}

		initializeAuth();
	}, []);

	const login = async (credentials) => {
		try {
			const response = await authService.login(credentials);
			setUser(response);
			return response;
		} catch (error) {
			const errorMessage = error.message || error.error || "Login failed. Please try again";
			throw new Error(errorMessage);
		}
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	const value = {
		user,
		login,
		logout,
		isAuthenticated: authService.isAuthenticated(),
		loading,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
