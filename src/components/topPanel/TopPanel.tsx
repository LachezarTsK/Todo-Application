import type { TitleIsNotValid } from "../../util/dataStructures";

import { db } from "../../data/db";
import { useState, useEffect } from "react";

import PopoverDisplaySearchInstructions from "./popoversTopPanel/PopoverDisplaySearchInstructions";
import PopoverTitleNotValidDisplay from "./popoversTopPanel/PopoverTitleNotValidDisplay";

import "../../styles/database.css";
import "../../styles/displayTodo.css";

interface TopPanelProps {
  handleSetMapIdToListIsExpanded: (id: number) => void;
  searchCriteria: string;
  searchEntry: string;
  setSearchCriteria: (searchCriteria: string) => void;
  setSearchEntry: React.Dispatch<React.SetStateAction<string>>;
}

const titleIsNotValid: TitleIsNotValid = {
  isEmpty: false,
  titleAlreadyExists: false,
};

export default function TopPanel({
  handleSetMapIdToListIsExpanded,
  searchCriteria,
  searchEntry,
  setSearchCriteria,
  setSearchEntry,
}: TopPanelProps) {
  const [newListTitle, setNewListTitle] = useState("");
  const [popoverTitleNotValidDisplay, setPopoverTitleNotValidDisplay] =
    useState(titleIsNotValid);
  const [
    popoverDisplaySearchInstructions,
    setPopoverDisplaySearchinstructions,
  ] = useState(false);

  useEffect(() => {
    if (
      popoverTitleNotValidDisplay.isEmpty ||
      popoverTitleNotValidDisplay.titleAlreadyExists
    ) {
      const id = setTimeout(
        () =>
          setPopoverTitleNotValidDisplay({
            isEmpty: false,
            titleAlreadyExists: false,
          }),
        5000,
      );
      return () => clearTimeout(id);
    }
  }, [popoverTitleNotValidDisplay]);

  async function deleteAllLists() {
    await db.todo.clear();
  }

  async function createNewList() {
    if (!newListTitle || newListTitle.trim().length === 0) {
      setPopoverTitleNotValidDisplay({
        ...popoverTitleNotValidDisplay,
        isEmpty: true,
      });
      return;
    }

    /*
      When comparing whether the list title already exists, the comparison deliberately
      does not ignore the case, for example, a list title of "a" is considered different from a list title of "A".

      Since this is a private and personal todo list, the user might well put different meanings 
      to one and the same title but with different capitalization. 
      
      Otherwise, if the newly entered title, after trim(), matches exactly, up to the capitalization, to an already 
      existing list title, the system will not allow it to be created, because it already exists.

      Of course, all these variations can be reworked quickly in whatever way is needed,
      so the presented variant is just one of many possibilities.
      */
    const allToDoLists = await db.todo.toArray();
    for (const current of allToDoLists) {
      if (current.title.trim().localeCompare(newListTitle.trim()) == 0) {
        setPopoverTitleNotValidDisplay({
          ...popoverTitleNotValidDisplay,
          titleAlreadyExists: true,
        });
        return;
      }
    }

    const todoList = {
      description: new Array<string>(),
      isCompleted: new Array<boolean>(),
    };
    const title = newListTitle;
    const id = await db.todo.add({ title, todoList });
    handleSetMapIdToListIsExpanded(id);
    setNewListTitle("");
  }

  return (
    <div className="containerTopPanel">
      <select
        className="input topPanel select"
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
      >
        <option hidden>select search criteria</option>
        <option className="input topPanel select">list id</option>
        <option className="input topPanel select">list title</option>
        <option className="input topPanel select">
          ratio completed tasks, entry format: integer/integer
        </option>
        <option className="input topPanel select">task description</option>
      </select>
      <PopoverDisplaySearchInstructions
        popoverDisplaySearchInstructions={popoverDisplaySearchInstructions}
        setPopoverDisplaySearchinstructions={
          setPopoverDisplaySearchinstructions
        }
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
      />
      <button
        className="button topPanel"
        onClick={() => {
          setSearchEntry("");
          setSearchCriteria("");
        }}
      >
        clear search
      </button>
      <input
        className="input topPanel"
        type="text"
        placeholder="enter new todo list title"
        value={newListTitle}
        onChange={(e) => setNewListTitle(e.target.value)}
      />
      <PopoverTitleNotValidDisplay
        popoverTitleNotValidDisplay={popoverTitleNotValidDisplay}
        createNewList={createNewList}
        setNewListTitle={setNewListTitle}
      />
      <button className="button topPanel" onClick={deleteAllLists}>
        delete all todo lists
      </button>
    </div>
  );
}
