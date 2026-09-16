import type { TODO, TaskIsNotValid } from "../../../util/dataStructures";

import { Popover } from "react-tiny-popover";

interface PopoverMapIdToNewTaskNotValidDisplayProps {
  todo: TODO;
  popoverMapIdToNewTaskNotValidDisplay: Map<number, TaskIsNotValid>;
  addTaskToList: (id: number) => Promise<void>;
}

export default function PopoverMapIdToNewTaskNotValidDisplay({
  todo,
  popoverMapIdToNewTaskNotValidDisplay,
  addTaskToList,
}: PopoverMapIdToNewTaskNotValidDisplayProps) {
  return (
    <Popover
      isOpen={
        popoverMapIdToNewTaskNotValidDisplay?.get(todo.id)?.isEmpty ||
        popoverMapIdToNewTaskNotValidDisplay?.get(todo.id)?.taskAlreadyExists ||
        false
      }
      content={
        <div className="popover information">
          {popoverMapIdToNewTaskNotValidDisplay?.get(todo.id)?.isEmpty ? (
            <>
              can not add task
              <br />
              task can not be empty
            </>
          ) : (
            <>
              can not add task
              <br />
              task already exists
            </>
          )}
        </div>
      }
      positions={["bottom", "right"]}
    >
      <td className="tableBodyAddTaskButton">
        <button
          className="button"
          onClick={() => {
            addTaskToList(todo.id);
          }}
        >
          add task
        </button>
      </td>
    </Popover>
  );
}
