import type { TODO, TitleIsNotValid } from "../../../util/dataStructures";

import { Popover } from "react-tiny-popover";

import "../../../styles/database.css";
import "../../../styles/displayTodo.css";

interface PopoverEditTitleOrDisplayExistingTitleProps {
  todo: TODO;
  popoverMapIdToTitleModificationNotValid: Map<number, TitleIsNotValid>;
  mapIdToIsEditingTitle: Map<number, boolean>;
  mapIdToListEditedTitle: Map<number, string>;
  handleSetMapIdToListTitle: (id: number, title: string) => void;
  editTitleList: (id: number) => Promise<void>;
  handleSetMapIdToIsEditingTitle: (id: number, isEditing: boolean) => void;
}

export default function PopoverEditTitleOrDisplayExistingTitle({
  todo,
  popoverMapIdToTitleModificationNotValid,
  mapIdToIsEditingTitle,
  mapIdToListEditedTitle,
  handleSetMapIdToListTitle,
  editTitleList,
  handleSetMapIdToIsEditingTitle,
}: PopoverEditTitleOrDisplayExistingTitleProps) {
  return (
    <Popover
      isOpen={
        popoverMapIdToTitleModificationNotValid.has(todo.id) &&
        (popoverMapIdToTitleModificationNotValid?.get(todo.id)?.isEmpty ||
          popoverMapIdToTitleModificationNotValid?.get(todo.id)
            ?.titleAlreadyExists ||
          false)
      }
      content={
        <div className="popover information">
          {popoverMapIdToTitleModificationNotValid?.get(todo.id)?.isEmpty ? (
            <>
              can not modify title
              <br />
              title can not be empty{" "}
            </>
          ) : (
            <>
              can not modify title
              <br />
              title already exists
            </>
          )}
        </div>
      }
      positions={["bottom", "right"]}
    >
      {mapIdToIsEditingTitle.get(todo.id) ? (
        <th className="tableHeadIsEditingTodoListTitle">
          <input
            className="input ListTitle"
            type="text"
            placeholder="enter title"
            value={mapIdToListEditedTitle.get(todo.id)}
            onChange={(e) => handleSetMapIdToListTitle(todo.id, e.target.value)}
          />
          <button
            className="button"
            onClick={() => {
              editTitleList(todo.id);
              handleSetMapIdToIsEditingTitle(todo.id, false);
            }}
          >
            confirm
          </button>
          <button
            className="button"
            onClick={() => {
              handleSetMapIdToIsEditingTitle(todo.id, false);
              handleSetMapIdToListTitle(todo.id, "");
            }}
          >
            cancel
          </button>
        </th>
      ) : (
        <th className="tableHeadTodoListTitle">{todo.title}</th>
      )}
    </Popover>
  );
}
