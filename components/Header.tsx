import React from 'react';
import { CoinIcon } from './icons/CoinIcon';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onCreateTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTask }) => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="bg-raxnet-charcoal shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-raxnet-teal">Raxnet</h1>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="flex items-center space-x-2 bg-raxnet-dark px-2 sm:px-3 py-1.5 rounded-full">
                        <CoinIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-white text-sm sm:text-base">{user.coinBalance.toLocaleString()}</span>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="font-semibold text-raxnet-text">{user.username}</p>
                        <p className="text-xs text-raxnet-text-muted">{user.email}</p>
                    </div>
                    <button
                        onClick={onCreateTask}
                        className="px-3 sm:px-4 py-2 bg-raxnet-teal hover:bg-raxnet-light-teal text-white font-semibold rounded-md shadow-sm transition duration-150 text-xs sm:text-sm"
                    >
                        Create Task
                    </button>
                    <button
                        onClick={logout}
                        className="px-3 sm:px-4 py-2 bg-raxnet-light-gray hover:bg-gray-600 text-white font-semibold rounded-md shadow-sm transition duration-150 text-xs sm:text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;