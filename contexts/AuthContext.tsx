import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await api.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Failed to refresh user:", error);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        refreshUser().finally(() => setLoading(false));

        const { data: authListener } = api.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await api.getUserProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
            if (loading) setLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [refreshUser]);

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const value = { user, loading, logout, refreshUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
