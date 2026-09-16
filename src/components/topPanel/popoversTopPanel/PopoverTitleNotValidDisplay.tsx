import type { TitleIsNotValid } from "../../../util/dataStructures";

import { Popover } from "react-tiny-popover";

import "../../../styles/database.css";
import "../../../styles/displayTodo.css";

interface PopoverTitleNotValidDisplayProps {
  popoverTitleNotValidDisplay: TitleIsNotValid;
  createNewList: () => Promise<void>;
  setNewListTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default function PopoverTitleNotValidDisplay({
  popoverTitleNotValidDisplay,
  createNewList,
  setNewListTitle,
}: PopoverTitleNotValidDisplayProps) {
  return (
    <Popover
      isOpen={
        popoverTitleNotValidDisplay.isEmpty ||
        popoverTitleNotValidDisplay.titleAlreadyExists
      }
      content={
        <div className="popover information">
          {popoverTitleNotValidDisplay.isEmpty ? (
            <>
              can not create list
              <br />
              title can not be empty{" "}
            </>
          ) : (
            <>
              can not create list
              <br />
              title already exists
            </>
          )}
        </div>
      }
      positions={["bottom", "right"]}
    >
      <button
        className="button topPanel"
        onClick={() => {
          createNewList();
          setNewListTitle("");
        }}
      >
        create new todo list
      </button>
    </Popover>
  );
}
