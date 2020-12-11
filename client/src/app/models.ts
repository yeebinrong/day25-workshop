export interface TodoSummary {
    id?: string;
    name: string;
}

export interface Todo {
    id?: string;
    name: string;
    due: string,
    tasks: Task[]
}

export interface Task {
    description: string;
    priority : Priority;
}

export enum Priority {
    Low = 0, Medium, High
}