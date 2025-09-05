import type { TaskData } from '../types';

import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface TaskBoxState {
    tasks: TaskData[];
    status: 'idle' | 'loading' | 'failed' | 'succeeded' ;
    error: string | null;
}

/*
 * The initial state of our store when the app loads.
 * Usually, we fetch this from a server.
 */


const TaskBoxData: TaskBoxState = {
    tasks: [],
    status: 'idle',
    error: null,
};


/*
 * Create an asyncThunk to fetch tasks from a remote endpoint.
 */
export const fetchTasks = createAsyncThunk('taskbox/fetchTasks', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
    const data = await response.json();
    const result = data.map(
        (task: {id: number; title: string; completed: boolean}) => ({
            id: `${task.id}`,
            title: task.title,
            state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX'
        })
    );
    return result;
});
 

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

        },
    },
        /*
        * extends the reducer for the async actions
        */
        extraReducers(builder) {
            builder
                .addCase(fetchTasks.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                    state.tasks = [];
                })
                .addCase(fetchTasks.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.error = null;
                    // add any fetched tasks to the array
                    state.tasks = action.payload;
                })
                .addCase(fetchTasks.rejected, (state) => {
                    state.status = 'failed';
                    state.error = 'Something went wrong';
                    state.tasks = [];
                });
        },
});



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

