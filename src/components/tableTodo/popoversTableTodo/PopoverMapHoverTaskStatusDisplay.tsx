import type { TODO } from "../../../util/dataStructures";

import { Popover } from "react-tiny-popover";
import { GiAnvilImpact, GiConfirmed } from "react-icons/gi";

import "../../../styles/database.css";
import "../../../styles/displayTodo.css";

interface PopoverMapHoverTaskStatusDisplayProps {
  todo: TODO;
  task: string;
  mapHoverTaskStatusDisplay: Map<string, boolean>;
  indexTask: number;
  editTaskIsCompletedStatus: (task: string) => Promise<void>;
  handleSetMapHoverTaskStatusDisplay: (
    taks: string,
    isDisplayed: boolean,
  ) => void;
}

export default function PopoverMapHoverTaskStatusDisplay({
  todo,
  task,
  mapHoverTaskStatusDisplay,
  indexTask,
  editTaskIsCompletedStatus,
  handleSetMapHoverTaskStatusDisplay,
}: PopoverMapHoverTaskStatusDisplayProps) {
  return (
    <Popover
      isOpen={mapHoverTaskStatusDisplay.get(task) || false}
      content={
        <div className="popover information">
          {todo.todoList.isCompleted[indexTask] ? (
            <>
              task completed
              <br />
              click to change status
            </>
          ) : (
            <>
              task in progress
              <br />
              click to change status
            </>
          )}
        </div>
      }
      positions={["bottom", "right"]}
    >
      <th
        onClick={() => editTaskIsCompletedStatus(task)}
        onMouseEnter={() => handleSetMapHoverTaskStatusDisplay(task, true)}
        onMouseLeave={() => handleSetMapHoverTaskStatusDisplay(task, false)}
      >
        {todo.todoList.isCompleted[indexTask] ? (
          <GiConfirmed className="tableBodyTaskIsCompleted" />
        ) : (
          <GiAnvilImpact className="tableBodyTaskIsInProgressIcon" />
        )}
      </th>
    </Popover>
  );
}
