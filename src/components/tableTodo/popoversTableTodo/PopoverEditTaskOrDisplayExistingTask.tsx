import type { TaskIsNotValid } from "../../../util/dataStructures";

import { Popover } from "react-tiny-popover";

import "../../../styles/database.css";
import "../../../styles/displayTodo.css";

interface PopoverEditTaskOrDisplayExistingTaskProps {
  task: string;
  popoverMapTaskToModificationNotValid: Map<string, TaskIsNotValid>;
  mapTaskToIsEditing: Map<string, boolean>;
  mapTaskToEditedTask: Map<string, string>;
  handleSetMapTaskToEditedTask: (task: string, editedTask: string) => void;
  editTaskDescription: (task: string) => Promise<void>;
  handleSetMapTaskToIsEditing: (task: string, isEditing: boolean) => void;
  deleteEntryFromMapTaskToEditedTask: (task: string) => void;
}

export default function PopoverEditTaskOrDisplayExistingTask({
  task,
  popoverMapTaskToModificationNotValid,
  mapTaskToIsEditing,
  mapTaskToEditedTask,
  handleSetMapTaskToEditedTask,
  editTaskDescription,
  handleSetMapTaskToIsEditing,
  deleteEntryFromMapTaskToEditedTask,
}: PopoverEditTaskOrDisplayExistingTaskProps) {
  return (
    <Popover
      isOpen={
        popoverMapTaskToModificationNotValid?.get(task)?.isEmpty ||
        popoverMapTaskToModificationNotValid?.get(task)?.taskAlreadyExists ||
        false
      }
      content={
        <div className="popover information">
          {popoverMapTaskToModificationNotValid?.get(task)?.isEmpty ? (
            <>
              can not modify task
              <br />
              task can not be empty
            </>
          ) : (
            <>
              can not modify task
              <br />
              task already exists
            </>
          )}
        </div>
      }
      positions={
        popoverMapTaskToModificationNotValid?.get(task)?.isEmpty
          ? ["top", "right"]
          : ["bottom", "right"]
      }
    >
      {mapTaskToIsEditing.get(task) ? (
        <td className="tableBodyIsEditingTaskDescription">
          <input
            className="input Task"
            type="text"
            placeholder="enter task"
            value={mapTaskToEditedTask.get(task)}
            onChange={(e) => handleSetMapTaskToEditedTask(task, e.target.value)}
          />

          <button
            className="button"
            onClick={() => {
              editTaskDescription(task);
              handleSetMapTaskToIsEditing(task, false);
            }}
          >
            confirm
          </button>

          <button
            className="button"
            onClick={() => {
              handleSetMapTaskToIsEditing(task, false);
              deleteEntryFromMapTaskToEditedTask(task);
            }}
          >
            cancel
          </button>
        </td>
      ) : (
        <td className="tableBodyTaskDescription">{task}</td>
      )}
    </Popover>
  );
}
