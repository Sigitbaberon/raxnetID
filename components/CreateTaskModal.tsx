import React, { useState } from 'react';
import { ActionType, Task } from '../types';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (taskData: Omit<Task, 'id' | 'creatorId' | 'creatorUsername' | 'status'>) => Promise<void>;
    userCoinBalance: number;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate, userCoinBalance }) => {
    const [url, setUrl] = useState('');
    const [actionType, setActionType] = useState<ActionType>(ActionType.LIKE);
    const [coinReward, setCoinReward] = useState<number | string>(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const resetForm = () => {
        setUrl('');
        setActionType(ActionType.LIKE);
        setCoinReward(10);
        setError('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const reward = Number(coinReward);
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('Please enter a valid URL (starting with http:// or https://).');
            return;
        }
        if (isNaN(reward) || reward <= 0) {
            setError('Coin reward must be a positive number.');
            return;
        }
        if (reward > userCoinBalance) {
            setError('You do not have enough coins for this reward.');
            return;
        }

        setIsLoading(true);
        try {
            await onCreate({ url, actionType, coinReward: reward });
            resetForm();
        } catch (err) {
            // Error is handled in Dashboard, but we can set a local one too if needed
            // setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-raxnet-charcoal rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-raxnet-light-gray">
                    <h2 className="text-2xl font-bold text-raxnet-text">Create New Task</h2>
                    <p className="text-sm text-raxnet-text-muted">Set up a task for other users to complete.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-raxnet-text-muted mb-1">Content URL</label>
                            <input type="url" id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/content" required className="w-full px-3 py-2 text-raxnet-text bg-raxnet-light-gray border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-raxnet-teal" />
                        </div>
                        <div>
                            <label htmlFor="actionType" className="block text-sm font-medium text-raxnet-text-muted mb-1">Action Type</label>
                            <select id="actionType" value={actionType} onChange={e => setActionType(e.target.value as ActionType)} required className="w-full px-3 py-2 text-raxnet-text bg-raxnet-light-gray border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-raxnet-teal capitalize">
                                {Object.values(ActionType).map(type => (
                                    <option key={type} value={type} className="capitalize">{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="coinReward" className="block text-sm font-medium text-raxnet-text-muted mb-1">Coin Reward</label>
                            <input type="number" id="coinReward" value={coinReward} onChange={e => setCoinReward(e.target.value)} min="1" required className="w-full px-3 py-2 text-raxnet-text bg-raxnet-light-gray border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-raxnet-teal" />
                            <p className="text-xs text-raxnet-text-muted mt-1">Your balance: {userCoinBalance} coins.</p>
                        </div>
                         {error && <p className="text-sm text-red-400">{error}</p>}
                    </div>
                    <div className="bg-raxnet-dark px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-raxnet-light-gray hover:bg-gray-600 text-white font-semibold rounded-md shadow-sm transition duration-150">Cancel</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-raxnet-teal hover:bg-raxnet-light-teal text-white font-semibold rounded-md shadow-sm transition duration-150 disabled:bg-gray-500">
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;