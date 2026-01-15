import React, {createContext, useContext, useState, useCallback, useEffect} from 'react';
import {apiService} from '../services/apiService';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    isAdmin: boolean;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    // Initialize auth state from token
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const userProfile = await apiService.getUserProfile();
                console.log('Initial profile load:', userProfile);

                if (typeof userProfile.isAdmin !== 'boolean') {
                    console.error('Invalid admin status:', userProfile.isAdmin);
                    throw new Error('Invalid admin status');
                }

                setUser(userProfile);
                setIsAdmin(userProfile.isAdmin);
                setIsAuthenticated(true);
                setToken(storedToken);
            } catch (error) {
                console.error('Auth initialization failed:', error);
                // Clear invalid auth state
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                setToken(null);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
            const response = await apiService.login({email, password});

            localStorage.setItem('token', response.token);
            setToken(response.token);
            setIsAuthenticated(true);

            // Fetch user profile after login
            const userProfile = await apiService.getUserProfile();
            setUser(userProfile);
            setIsAdmin(userProfile.isAdmin);

    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setIsAdmin(false);
        apiService.logout();
    }, []);

    // Update apiService token when it changes
    useEffect(() => {
        if (token) {
            // Update axios instance configuration
            const axiosInstance = apiService['api'];
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        token,
        isAdmin, isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;