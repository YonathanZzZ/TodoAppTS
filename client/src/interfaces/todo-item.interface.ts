export type contentType = string;
export type doneType = boolean;
export type idType = string;

export interface TodoData {
    content: contentType;
    done: doneType;
}

export interface Todo extends TodoData { //includes TodoData + id
    id: idType;
}