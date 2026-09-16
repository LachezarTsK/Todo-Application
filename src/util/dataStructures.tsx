
export interface TODO {
  id: number;
  title: string;
  todoList: { description: string[]; isCompleted: boolean[] };
}

export interface TitleIsNotValid {
  isEmpty: boolean;
  titleAlreadyExists: boolean;
}

export interface TaskIsNotValid {
  isEmpty: boolean;
  taskAlreadyExists: boolean;
}