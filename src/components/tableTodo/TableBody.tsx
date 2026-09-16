import type { TODO, TaskIsNotValid } from "../../util/dataStructures";

import { useState, useEffect } from "react";
import { db } from "../../data/db";

import PopoverEditTaskOrDisplayExistingTask from "./popoversTableTodo/PopoverEditTaskOrDisplayExistingTask";
import PopoverMapHoverTaskStatusDisplay from "./popoversTableTodo/PopoverMapHoverTaskStatusDisplay";

import "../../styles/database.css";
import "../../styles/displayTodo.css";

interface TableBodyProps {
  todos: TODO[] | undefined;
  todo: TODO;
  mapIdToListIsExpanded: Map<number, boolean>;
}

export default function TableBody({
  todos,
  todo,
  mapIdToListIsExpanded,
}: TableBodyProps) {
  const [mapTaskToIsEditing, setMapTaskToIsEditing] = useState(
    new Map<string, boolean>(),
  );
  const [mapTaskToEditedTask, setMapTaskToEditedTask] = useState(
    new Map<string, string>(),
  );
  const [mapHoverTaskStatusDisplay, setMapHoverTaskStatusDisplay] = useState(
    new Map<string, boolean>(),
  );

  const [
    popoverMapTaskToModificationNotValid,
    setPopoverMapTaskToModificationNotValid,
  ] = useState(new Map<string, TaskIsNotValid>());

  function handleSetMapTaskToEditedTask(task: string, editedTask: string) {
    const clone = new Map<string, string>(mapTaskToEditedTask);
    clone.set(task, editedTask);
    setMapTaskToEditedTask(clone);
  }

  function handleSetMapHoverTaskStatusDisplay(
    taks: string,
    isDisplayed: boolean,
  ) {
    const clone = new Map<string, boolean>(mapHoverTaskStatusDisplay);
    clone.set(taks, isDisplayed);
    setMapHoverTaskStatusDisplay(clone);
  }

  function handleSetPopoverMapTaskToModificationNotValid(
    task: string,
    isEmpty: boolean,
    taskAlreadyExists: boolean,
  ) {
    const clone = new Map<string, TaskIsNotValid>(
      popoverMapTaskToModificationNotValid,
    );
    clone.set(task, { isEmpty: isEmpty, taskAlreadyExists: taskAlreadyExists });
    setPopoverMapTaskToModificationNotValid(clone);
  }

  function deleteEntryFromMapTaskToEditedTask(task: string) {
    const clone = new Map(mapTaskToEditedTask);
    clone.delete(task);
    setMapTaskToEditedTask(clone);
  }

  function handleSetMapTaskToIsEditing(task: string, isEditing: boolean) {
    const clone = new Map<string, boolean>(mapTaskToIsEditing);
    clone.set(task, isEditing);
    setMapTaskToIsEditing(clone);
  }

  useEffect(() => {
    let taskForModification = null;

    for (const [task, taskIsNotValid] of popoverMapTaskToModificationNotValid) {
      if (taskIsNotValid?.isEmpty || taskIsNotValid?.taskAlreadyExists) {
        taskForModification = task;
        break;
      }
    }
    if (taskForModification != null) {
      const id = setTimeout(
        () =>
          handleSetPopoverMapTaskToModificationNotValid(
            taskForModification,
            false,
            false,
          ),
        5000,
      );
      return () => clearTimeout(id);
    }
  }, [popoverMapTaskToModificationNotValid]);

  async function editTaskDescription(task: string) {
    const editedTask: string | undefined = mapTaskToEditedTask.get(task.trim());
    deleteEntryFromMapTaskToEditedTask(task);

    if (!mapTaskToEditedTask || !editedTask || editedTask?.trim().length == 0) {
      handleSetPopoverMapTaskToModificationNotValid(task, true, false);
      return;
    }

    let todoList = todo.todoList;

    for (const task of todoList.description) {
      if (task.trim().localeCompare(editedTask.trim()) === 0) {
        handleSetPopoverMapTaskToModificationNotValid(task, false, true);
        return;
      }
    }

    const index = todoList.description.indexOf(task);

    const description = [
      ...todoList.description.slice(0, index),
      editedTask.trim(),
      ...todoList.description.slice(index + 1),
    ];
    const isCompleted = todoList.isCompleted;

    todoList = { description, isCompleted };
    await db.todo.where("id").equals(todo.id).modify({ todoList: todoList });
  }

  async function editTaskIsCompletedStatus(task: string) {
    let todoList = todo.todoList;
    const index = todoList.description.indexOf(task.trim());
    const isCompletedNewStatus = !todoList.isCompleted[index];

    const description = todoList.description;
    const isCompleted = [
      ...todoList.isCompleted.slice(0, index),
      isCompletedNewStatus,
      ...todoList.isCompleted.slice(index + 1),
    ];

    todoList = { description, isCompleted };
    await db.todo.where("id").equals(todo.id).modify({ todoList: todoList });
  }

  async function deleteTaskFromList(id: number, taskToDelete: string) {
    if (!todos || todos.length === 0) {
      return;
    }

    const NOT_FOUND = -1;
    for (const current of todos) {
      if (current.id === id) {
        let todoList = current.todoList;
        const index = todoList.description.indexOf(taskToDelete);
        if (index === NOT_FOUND) {
          return;
        }

        const description = [
          ...todoList.description.slice(0, index),
          ...todoList.description.slice(index + 1),
        ];
        const isCompleted = [
          ...todoList.isCompleted.slice(0, index),
          ...todoList.isCompleted.slice(index + 1),
        ];

        todoList = { description, isCompleted };
        await db.todo.where("id").equals(id).modify({ todoList: todoList });
        break;
      }
    }
  }

  return (
    <tbody key={todo.id}>
      {todo.todoList &&
        mapIdToListIsExpanded.get(todo.id) &&
        todo?.todoList?.description?.map((task, indexTask) => (
          <tr key={task} className="containerDisplay">
            <td scope="row" className="tableBodyTaskNo">
              {indexTask + 1}
            </td>
            <PopoverEditTaskOrDisplayExistingTask
              task={task}
              popoverMapTaskToModificationNotValid={
                popoverMapTaskToModificationNotValid
              }
              mapTaskToIsEditing={mapTaskToIsEditing}
              mapTaskToEditedTask={mapTaskToEditedTask}
              handleSetMapTaskToEditedTask={handleSetMapTaskToEditedTask}
              editTaskDescription={editTaskDescription}
              handleSetMapTaskToIsEditing={handleSetMapTaskToIsEditing}
              deleteEntryFromMapTaskToEditedTask={
                deleteEntryFromMapTaskToEditedTask
              }
            />
            <PopoverMapHoverTaskStatusDisplay
              todo={todo}
              task={task}
              mapHoverTaskStatusDisplay={mapHoverTaskStatusDisplay}
              indexTask={indexTask}
              editTaskIsCompletedStatus={editTaskIsCompletedStatus}
              handleSetMapHoverTaskStatusDisplay={
                handleSetMapHoverTaskStatusDisplay
              }
            />
            <th className="tableHeadEditTaskInTodoListButton">
              <button
                className="button"
                onClick={() => handleSetMapTaskToIsEditing(task, true)}
              >
                edit task
              </button>
            </th>
            <td className="tableBodyDeleteTaskButton">
              <button
                className="button"
                onClick={() => deleteTaskFromList(todo.id, task)}
              >
                delete task
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  );
}
