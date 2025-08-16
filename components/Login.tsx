import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('alice@raxnet.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { refreshUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.login(email, password);
            // AuthProvider's onAuthStateChange will handle setting the user
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await api.loginWithGoogle();
            // The onAuthStateChange listener in AuthContext will handle the redirect and subsequent login state.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google login failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-raxnet-dark">
            <div className="w-full max-w-md p-8 space-y-8 bg-raxnet-charcoal rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-raxnet-teal">Raxnet</h1>
                    <p className="mt-2 text-raxnet-text-muted">Engage. Earn. Excel.</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-raxnet-text-muted">
                            Email address (try 'alice@raxnet.com')
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-raxnet-text bg-raxnet-light-gray border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-raxnet-teal"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-bold text-raxnet-text-muted"
                        >
                            Password (try 'password')
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 text-raxnet-text bg-raxnet-light-gray border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-raxnet-teal"
                        />
                    </div>
                     {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-raxnet-teal hover:bg-raxnet-light-teal text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-raxnet-dark focus:ring-raxnet-light-teal disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-raxnet-charcoal text-raxnet-text-muted">Or continue with</span>
                    </div>
                </div>
                <div>
                     <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-raxnet-light-gray text-sm font-medium text-raxnet-text hover:bg-gray-700 transition duration-150 disabled:opacity-50"
                     >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        Sign in with Google
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Login;