import { supabase } from './supabase';
import { User, Task, TaskStatus, ActionType } from '../types';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Interfaces for raw Supabase data to avoid using 'any'
interface SupabaseProfile {
    id: string;
    username: string;
    email: string;
    coin_balance: number;
}

interface SupabaseTask {
    id: number;
    creator_id: string;
    users: { username: string } | null;
    url: string;
    action_type: ActionType;
    coin_reward: number;
    status: TaskStatus;
    completer_id: string | null;
    created_at: string;
}

// Helper to map Supabase user profile to our app's User type
const mapUserFromSupabase = (profile: SupabaseProfile): User => ({
    id: profile.id,
    username: profile.username,
    email: profile.email,
    coinBalance: profile.coin_balance,
});

// Helper to map Supabase task to our app's Task type
const mapTaskFromSupabase = (task: SupabaseTask): Task => ({
    id: task.id,
    creatorId: task.creator_id,
    creatorUsername: task.users?.username || 'Unknown',
    url: task.url,
    actionType: task.action_type,
    coinReward: task.coin_reward,
    status: task.status,
    completerId: task.completer_id,
});


/**
 * Fetches a user's public profile by their ID.
 */
const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, email, coin_balance')
        .eq('id', userId)
        .single();
        
    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
    return data ? mapUserFromSupabase(data as SupabaseProfile) : null;
};

/**
 * Attempts to log in a user with email and password.
 */
const login = async (email: string, pass: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    if (!data.user) throw new Error("Login failed, no user returned.");
    
    const userProfile = await getUserProfile(data.user.id);
    if (!userProfile) throw new Error("User profile not found.");
    
    return userProfile;
};

/**
 * Initiates Google OAuth login.
 * The redirectTo URL is dynamically set to the current application's origin,
 * ensuring it works across different deployment environments as requested.
 */
const loginWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // This dynamically sets the redirect URL to the current domain (e.g., https://sosial.raxnet.my.id).
            // Supabase's client library will automatically handle the session from the URL upon redirection.
            redirectTo: window.location.origin,
        },
    });
    if (error) throw error;
};

/**
 * Gets the current authenticated user's profile.
 */
const getCurrentUser = async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    return getUserProfile(session.user.id);
};

/**
 * Logs out the current user.
 */
const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

/**
 * Subscribes to authentication state changes.
 */
const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

/**
 * Fetches all available tasks, joining with creator's username.
 */
const fetchTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*, users ( username )')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(task => mapTaskFromSupabase(task as SupabaseTask));
};

/**
 * Creates a new task and debits coins from the creator.
 * Assumes a Supabase RPC function `create_task` exists for atomicity.
 */
const createTask = async (data: Omit<Task, 'id' | 'creatorId' | 'creatorUsername' | 'status'>): Promise<void> => {
    // This assumes an RPC function `create_task` exists in your Supabase backend
    // to handle the transaction of creating a task and debiting coins atomically.
    const { error } = await supabase.rpc('create_task', {
        p_url: data.url,
        p_action_type: data.actionType,
        p_coin_reward: data.coinReward
    });

    if (error) {
        // Provide a more user-friendly error message
        if (error.message.includes('insufficient_funds')) {
            throw new Error("You do not have enough coins to create this task.");
        }
        throw new Error(`Failed to create task: ${error.message}`);
    }
};

/**
 * Marks a task as complete and credits coins to the completer.
 * Assumes a Supabase RPC function `complete_task` exists for atomicity.
 */
const completeTask = async (taskId: number): Promise<void> => {
    // This assumes an RPC function `complete_task` exists in your Supabase backend
    // to handle the transaction of updating task status and crediting coins.
     const { error } = await supabase.rpc('complete_task', {
        p_task_id: taskId
    });

    if (error) {
         if (error.message.includes('own_task')) {
            throw new Error("You cannot complete your own task.");
        }
         if (error.message.includes('not_pending')) {
            throw new Error("This task is no longer available.");
        }
        throw new Error(`Failed to complete task: ${error.message}`);
    }
};

export const api = {
    login,
    loginWithGoogle,
    getCurrentUser,
    getUserProfile,
    logout,
    onAuthStateChange,
    fetchTasks,
    createTask,
    completeTask,
};