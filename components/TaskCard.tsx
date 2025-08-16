import React, {useState} from 'react';
import { Task, User, ActionType, TaskStatus } from '../types';
import { LikeIcon } from './icons/LikeIcon';
import { CommentIcon } from './icons/CommentIcon';
import { ShareIcon } from './icons/ShareIcon';
import { FollowIcon } from './icons/FollowIcon';
import { SubscribeIcon } from './icons/SubscribeIcon';
import { CoinIcon } from './icons/CoinIcon';

interface TaskCardProps {
    task: Task;
    currentUser: User;
    onCompleteTask: (taskId: number) => Promise<void>;
}

const actionIcons: Record<ActionType, React.ReactNode> = {
    [ActionType.LIKE]: <LikeIcon className="w-6 h-6" />,
    [ActionType.COMMENT]: <CommentIcon className="w-6 h-6" />,
    [ActionType.SHARE]: <ShareIcon className="w-6 h-6" />,
    [ActionType.FOLLOW]: <FollowIcon className="w-6 h-6" />,
    [ActionType.SUBSCRIBE]: <SubscribeIcon className="w-6 h-6" />,
};

const TaskCard: React.FC<TaskCardProps> = ({ task, currentUser, onCompleteTask }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isCompleted = task.status === TaskStatus.COMPLETED;
    const isOwnTask = task.creatorId === currentUser.id;

    const handleComplete = async () => {
        setIsLoading(true);
        await onCompleteTask(task.id);
        setIsLoading(false);
    };

    const getStatusBadge = () => {
        switch (task.status) {
            case TaskStatus.COMPLETED:
                return <span className="text-xs font-semibold px-2 py-1 bg-green-500 text-white rounded-full">Completed</span>;
            case TaskStatus.PENDING:
                return <span className="text-xs font-semibold px-2 py-1 bg-yellow-500 text-black rounded-full">Pending</span>;
            default:
                return <span className="text-xs font-semibold px-2 py-1 bg-gray-500 text-white rounded-full">Unknown</span>;
        }
    };

    return (
        <div className="bg-raxnet-charcoal rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transition-transform hover:scale-105 duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-raxnet-light-gray rounded-full flex items-center justify-center text-raxnet-teal">
                            {actionIcons[task.actionType]}
                        </div>
                        <div>
                            <p className="text-lg font-bold capitalize text-raxnet-text">{task.actionType} Task</p>
                            <p className="text-sm text-raxnet-text-muted">by {task.creatorUsername}</p>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
                <a 
                    href={task.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-raxnet-light-teal hover:underline break-all"
                >
                    {task.url}
                </a>
            </div>
            <div className="bg-raxnet-light-gray px-5 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <CoinIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-xl font-bold text-white">{task.coinReward}</span>
                </div>
                <button
                    onClick={handleComplete}
                    disabled={isCompleted || isOwnTask || isLoading}
                    className="px-4 py-2 w-28 text-center bg-raxnet-teal text-white font-semibold rounded-md shadow-sm transition duration-150 hover:bg-raxnet-light-teal disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (isCompleted ? 'Done' : 'Complete')}
                </button>
            </div>
        </div>
    );
};

export default TaskCard;