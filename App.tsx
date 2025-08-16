import React from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-raxnet-dark">
                <div className="text-2xl font-bold text-raxnet-teal">Loading Raxnet...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-raxnet-dark font-sans">
            {user ? <Dashboard /> : <Login />}
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;