import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';
import Notification from './Notification';
import { Task, ActionType, Notification as NotificationType } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { ACTION_TYPE_CONFIG } from '../constants';

const Dashboard: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [activeFilter, setActiveFilter] = useState<ActionType | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    
    const addNotification = useCallback((message: string, type: NotificationType['type']) => {
        const newNotification: NotificationType = {
            id: Date.now(),
            message,
            type
        };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 3000);
    }, []);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedTasks = await api.fetchTasks();
            setTasks(fetchedTasks);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            addNotification("Failed to load tasks.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);
    
    useEffect(() => {
        fetchTasks();
        
        const channel = supabase.channel('public:tasks');
        
        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, 
            (payload) => {
                console.log('Change received!', payload);
                // Just refetch all tasks to get the latest state including joins
                fetchTasks();
            }
          )
          .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchTasks]);


    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter(task => task.actionType === activeFilter));
        }
    }, [tasks, activeFilter]);
    
    if (!user) {
        return null; // or a loading spinner, since App.tsx handles the main loading state
    }

    const handleCreateTask = async (taskData: Omit<Task, 'id' | 'creatorUsername' | 'status' | 'creatorId'>) => {
        try {
            await api.createTask(taskData);
            await refreshUser();
            // Real-time listener will handle task feed update
            addNotification("Task created successfully!", "success");
            setIsModalOpen(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(`Failed to create task: ${errorMessage}`, "error");
        }
    };
    
    const handleCompleteTask = async (taskId: number) => {
        try {
            await api.completeTask(taskId);
            await refreshUser();
             // Real-time listener will handle task feed update
            addNotification("Task completed! Coins earned.", "success");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(`Failed to complete task: ${errorMessage}`, "error");
        }
    }

    return (
        <div className="min-h-screen bg-raxnet-dark">
            <Header onCreateTask={() => setIsModalOpen(true)} />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-raxnet-text">Task Feed</h2>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-full transition flex items-center ${activeFilter === 'all' ? 'bg-raxnet-teal text-white' : 'bg-raxnet-charcoal text-raxnet-text-muted hover:bg-raxnet-light-gray'}`}>All</button>
                        {Object.entries(ACTION_TYPE_CONFIG).map(([type, {label, icon: IconComponent}]) => (
                            <button key={type} onClick={() => setActiveFilter(type as ActionType)} className={`px-4 py-2 text-sm font-semibold rounded-full transition capitalize flex items-center ${activeFilter === type ? 'bg-raxnet-teal text-white' : 'bg-raxnet-charcoal text-raxnet-text-muted hover:bg-raxnet-light-gray'}`}>
                                <IconComponent className="w-4 h-4 mr-2" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                     <div className="text-center text-raxnet-text-muted">Loading tasks...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.length > 0 ? filteredTasks.map(task => (
                            <TaskCard key={task.id} task={task} currentUser={user} onCompleteTask={handleCompleteTask}/>
                        )) : (
                            <div className="col-span-full text-center text-raxnet-text-muted py-10">
                                <p className="text-lg">No tasks available in this category.</p>
                                <p className="text-sm">Try creating a new task or checking another category!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            {isModalOpen && (
                <CreateTaskModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onCreate={handleCreateTask}
                    userCoinBalance={user.coinBalance}
                />
            )}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 w-full max-w-xs">
                {notifications.map(notif => (
                    <Notification key={notif.id} message={notif.message} type={notif.type} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
