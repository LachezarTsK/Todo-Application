import type { TODO } from "./dataStructures";

const NOT_FOUND = -1;

export function getRatioNumberOfCompletedTasksToAllTasks(todo: TODO): string {
  let numberOfCompletedTasks = 0;
  for (const isComplete of todo.todoList.isCompleted) {
    if (isComplete) {
      ++numberOfCompletedTasks;
    }
  }
  return numberOfCompletedTasks + "/" + todo.todoList.isCompleted.length;
}

export function hasTaskContainingSearchEntry(
  todo: TODO,
  searchEntry: string,
): boolean {
  searchEntry = searchEntry.toLocaleLowerCase().trim();
  for (const description of todo.todoList.description) {
    if (
      description.trim().toLocaleLowerCase().indexOf(searchEntry) !== NOT_FOUND
    ) {
      return true;
    }
  }
  return false;
}
