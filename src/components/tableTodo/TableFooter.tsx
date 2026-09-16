import type { TODO, TaskIsNotValid } from "../../util/dataStructures";

import { db } from "../../data/db";
import { useState, useEffect } from "react";

import PopoverMapIdToNewTaskNotValidDisplay from "./popoversTableTodo/PopoverMapIdToNewTaskNotValidDisplay";

import "../../styles/database.css";
import "../../styles/displayTodo.css";

const PLACEHOLDER_ID_LIST = -1;

interface TableFooterProps {
  todos: TODO[] | undefined;
  todo: TODO;
  mapIdToListIsExpanded: Map<number, boolean>;
}

export default function TableFooter({
  todos,
  todo,
  mapIdToListIsExpanded,
}: TableFooterProps) {
  const [mapIdToNewTask, setMapIdToNewTask] = useState(
    new Map<number, string>(),
  );

  const [
    popoverMapIdToNewTaskNotValidDisplay,
    setMapIdToNewTaskNotValidDisplay,
  ] = useState(new Map<number, TaskIsNotValid>());

  function handleSetMapIdToNewTask(id: number, task: string) {
    const clone = new Map<number, string>(mapIdToNewTask);
    clone.set(id, task);
    setMapIdToNewTask(clone);
  }

  function handleSetMapIdToNewTaskNotValidDisplay(
    id: number,
    isEmpty: boolean,
    taskAlreadyExists: boolean,
  ) {
    const clone = new Map<number, TaskIsNotValid>(
      popoverMapIdToNewTaskNotValidDisplay,
    );
    const taskIsNotValid: TaskIsNotValid = {
      isEmpty: isEmpty,
      taskAlreadyExists: taskAlreadyExists,
    };
    clone.set(id, taskIsNotValid);

    setMapIdToNewTaskNotValidDisplay(clone);
  }

  useEffect(() => {
    let listIdForNotValidNewTask = PLACEHOLDER_ID_LIST;

    for (const [
      listId,
      taskIsNotValid,
    ] of popoverMapIdToNewTaskNotValidDisplay) {
      if (taskIsNotValid?.isEmpty || taskIsNotValid?.taskAlreadyExists) {
        listIdForNotValidNewTask = listId;
        break;
      }
    }
    if (listIdForNotValidNewTask != PLACEHOLDER_ID_LIST) {
      const id = setTimeout(
        () =>
          handleSetMapIdToNewTaskNotValidDisplay(
            listIdForNotValidNewTask,
            false,
            false,
          ),
        5000,
      );
      return () => clearTimeout(id);
    }
  }, [popoverMapIdToNewTaskNotValidDisplay]);

  async function addTaskToList(id: number) {
    let newTask: string | undefined = mapIdToNewTask.get(id);
    handleSetMapIdToNewTask(id, "");

    if (
      !newTask ||
      newTask?.trim().length === 0 ||
      !todos ||
      todos.length === 0
    ) {
      handleSetMapIdToNewTaskNotValidDisplay(id, true, false);
      return;
    }

    /*
      When comparing whether the task descritpion already exists in the corresponding todo list, 
      the comparison deliberately does not ignore the case, for example, a task descritpion 
      of "a" is considered different from a task descritpion of "A".

      Since this is a private and personal todo list, the user might well put different meanings 
      to one and the same task descritpion but with different capitalization. 
      
      Otherwise, if the newly entered task descritpion, after trim(), matches exactly, up to the capitalization,
      to an already existing task descritpion in the corresponding todo list, the system will not allow it 
      to be created, because it already exists.

      Of course, all these variations can be reworked quickly in whatever way is needed,
      so the presented variant is just one of many possibilities.
      */
    newTask = newTask.trim();
    for (const current of todos) {
      if (current.id === id) {
        const todoList = current.todoList;
        for (const task of todoList.description) {
          if (newTask?.localeCompare(task) === 0) {
            handleSetMapIdToNewTaskNotValidDisplay(id, false, true);
            return;
          }
        }

        todoList.description.push(newTask);
        todoList.isCompleted.push(false);
        await db.todo.where("id").equals(id).modify({ todoList: todoList });
      }
    }
  }

  return (
    <tfoot key={todo.id}>
      {mapIdToListIsExpanded.get(todo.id) && (
        <tr key={todo.title} className="containerDisplay">
          <td scope="row" className="tableBodyTaskNo">
            {todo?.todoList?.description?.length + 1}
          </td>
          <td className="tableFooterAddNewTaskInput">
            <input
              className="input"
              type="text"
              placeholder="enter task"
              value={mapIdToNewTask.get(todo.id)}
              onChange={(e) => handleSetMapIdToNewTask(todo.id, e.target.value)}
            />
          </td>
          <PopoverMapIdToNewTaskNotValidDisplay
            todo={todo}
            popoverMapIdToNewTaskNotValidDisplay={
              popoverMapIdToNewTaskNotValidDisplay
            }
            addTaskToList={addTaskToList}
          />
        </tr>
      )}
    </tfoot>
  );
}
