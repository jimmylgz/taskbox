import type { TaskData } from '../types';

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskBoxState {
    tasks: TaskData[];
    status: 'idle' | 'loading' | 'failed' ;
    error: string | null;
}

/*
 * The initial state of our store when the app loads.
 */
const defaultTasks: TaskData[] = [
    { id: '1', title: 'Something', state: 'TASK_INBOX' },
    { id: '2', title: 'Something more', state: 'TASK_INBOX' },
    { id: '3', title: 'Something else', state: 'TASK_INBOX' },
    { id: '4', title: 'Something again', state: 'TASK_INBOX' }
];

const TaskBoxData: TaskBoxState = {
    tasks: defaultTasks,
    status: 'idle',
    error: null,
};

/*
 * The store is created here.
*/

const TasksSlice = createSlice({
    name: 'taskbox',
    initialState: TaskBoxData,
    reducers: {
        updateTaskState: (
            state,
            action: PayloadAction<{ id: string; newTaskState: TaskData['state']} >
        ) => {
            const task = state.tasks.find((task) => task.id === action.payload.id);
            if (task) {
                task.state = action.payload.newTaskState;
            }

        }
    }
})

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState} = TasksSlice.actions;

// app's store configuration goes here

const store = configureStore({
    reducer: {
        taskbox: TasksSlice.reducer,  // 将 slice reducer 注册到 store
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

