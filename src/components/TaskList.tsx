// import type { TaskData } from "../types";

import Task from "./Task";

import { useDispatch, useSelector } from "react-redux";

import { updateTaskState, RootState, AppDispatch } from "../lib/store";

// type TaskListProps = {
//   // check if it's in loading stage
//   loading?: boolean;
//   // The list of tasks
//   tasks: TaskData[];
//   // event to change the task to pinned
//   onPinTask: (id: string) => void;
//   // event to change the task to archived
//   onArchiveTask: (id: string) => void;
// };

// export default function TaskList({
//   loading = false,
//   tasks,
//   onPinTask,
//   onArchiveTask,
// }: TaskListProps) {
//   const events = {
//     onPinTask,
//     onArchiveTask,
//   };

export default function TaskList() {
  // retrieving our state from the store
  const tasks = useSelector((state: RootState) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === "TASK_PINNED"),
      ...state.taskbox.tasks.filter((t) => t.state !== "TASK_PINNED"),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    );
    return filteredTasks;
  });
  const { status } = useSelector((state: RootState) => state.taskbox);
  const dispatch = useDispatch<AppDispatch>();
  const pinTask = (value: string) => {
    // dispatching the pinned event back to the store
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_PINNED" }));
  };
  const archiveTask = (value: string) => {
    // dispatching the archived event back to the store
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_ARCHIVED" }));
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (status === "loading") {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check">
            <p className="title-message">You have no tasks</p>
            <p className="subtitle-message">Sit back and relax</p>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key="success">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={pinTask}
          onArchiveTask={archiveTask}
        />
      ))}
    </div>
  );
}

//   if (loading) {
//     return (
//       <div className="list-items" data-testid="loading" key={"loading"}>
//         {LoadingRow}
//         {LoadingRow}
//         {LoadingRow}
//         {LoadingRow}
//         {LoadingRow}
//         {LoadingRow}
//       </div>
//     );
//   }

//   if (tasks.length === 0) {
//     return (
//       <div className="list-items" key={"empty"} data-testid="empty">
//         <div className="wrapper-message">
//           <span className="icon-check">
//             <p className="title-message">You have no tasks</p>
//             <p className="subtitle-message">Sit back and relax</p>
//           </span>
//         </div>
//       </div>
//     );
//   }

//   const tasksInOrder = [
//     ...tasks.filter((t) => t.state === "TASK_PINNED"),
//     ...tasks.filter((t) => t.state !== "TASK_PINNED"),
//   ];

//   return (
//     <div className="list-items">
//       {tasksInOrder.map((task) => (
//         <Task key={task.id} task={task} {...events} />
//       ))}
//     </div>
//   );
// }
