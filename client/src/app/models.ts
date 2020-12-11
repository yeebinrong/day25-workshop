export interface TodoSummary {
    id?: string;
    name: string;
    due: string;
}

export interface Todo {
    id?: string;
    name: string;
    due: string,
    tasks: Task[]
}

export interface Task {
    task_id?: string;
    id?: string;
    description: string;
    priority : string;
}

// export enum Priority {
//     Low, Medium, High
// }