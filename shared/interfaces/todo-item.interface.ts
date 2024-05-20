export interface TodoData {
    content: string;
    done: boolean;
}

export interface Todo extends TodoData { //includes TodoData + id
    id: string;
}