import type { TODO, TitleIsNotValid } from "../../util/dataStructures";

import { db } from "../../data/db";
import { useState, useEffect } from "react";
import { getRatioNumberOfCompletedTasksToAllTasks } from "../../util/functions";

import PopoverMapHoverListIsExpandedStatusDisplay from "./popoversTableTodo/PopoverMapHoverListIsExpandedStatusDisplay";
import PopoverEditTitleOrDisplayExistingTitle from "./popoversTableTodo/PopoverEditTitleOrDisplayExistingTitle";

import "../../styles/database.css";
import "../../styles/displayTodo.css";

const PLACEHOLDER_ID_LIST = -1;

interface TableHeaderProps {
  todos: TODO[] | undefined;
  todo: TODO;
  indexList: number;
  handleSetMapIdToListIsExpanded: (id: number) => void;
  mapIdToListIsExpanded: Map<number, boolean>;
}

export default function TableHeader({
  todos,
  todo,
  indexList,
  handleSetMapIdToListIsExpanded,
  mapIdToListIsExpanded,
}: TableHeaderProps): React.JSX.Element {
  const [mapIdToListEditedTitle, setMapIdToListEditedTitle] = useState(
    new Map<number, string>(),
  );

  const [mapIdToIsEditingTitle, setMapIdToIsEditingTitle] = useState(
    new Map<number, boolean>(),
  );

  const [
    mapHoverListIsExpandedStatusDisplay,
    setMapHoverListIsExpandedStatusDisplay,
  ] = useState(new Map<number, boolean>());

  const [
    popoverMapIdToTitleModificationNotValid,
    setPopoverMapIdToTitleModificationNotValid,
  ] = useState(new Map<number, TitleIsNotValid>());

  useEffect(() => {
    let idOfListForModification = PLACEHOLDER_ID_LIST;

    for (const [
      id,
      titleIsNotValid,
    ] of popoverMapIdToTitleModificationNotValid) {
      if (titleIsNotValid?.isEmpty || titleIsNotValid?.titleAlreadyExists) {
        idOfListForModification = id;
        break;
      }
    }

    if (idOfListForModification != PLACEHOLDER_ID_LIST) {
      const id = setTimeout(
        () =>
          handleSetPopoverMapIdToTitleModificationNotValid(
            idOfListForModification,
            false,
            false,
          ),
        5000,
      );
      return () => clearTimeout(id);
    }
  }, [popoverMapIdToTitleModificationNotValid]);

  function handleSetPopoverMapIdToTitleModificationNotValid(
    id: number,
    isEmpty: boolean,
    titleAlreadyExists: boolean,
  ) {
    const clone = new Map<number, TitleIsNotValid>(
      popoverMapIdToTitleModificationNotValid,
    );
    clone.set(id, { isEmpty: isEmpty, titleAlreadyExists: titleAlreadyExists });
    setPopoverMapIdToTitleModificationNotValid(clone);
  }

  function handleSetMapIdToListTitle(id: number, title: string) {
    const clone = new Map(mapIdToListEditedTitle);
    clone.set(id, title);
    setMapIdToListEditedTitle(clone);
  }

  function handleSetMapIdToIsEditingTitle(id: number, isEditing: boolean) {
    const clone = new Map(mapIdToIsEditingTitle);
    clone.set(id, isEditing);
    setMapIdToIsEditingTitle(clone);
  }

  function handleSetMapHoverListIsExpandedStatusDisplay(
    id: number,
    isDisplayed: boolean,
  ) {
    const clone = new Map<number, boolean>(mapHoverListIsExpandedStatusDisplay);
    clone.set(id, isDisplayed);
    setMapHoverListIsExpandedStatusDisplay(clone);
  }

  async function editTitleList(id: number) {
    const title: string | undefined = mapIdToListEditedTitle.get(id);
    handleSetMapIdToListTitle(id, "");

    if (!title || title?.trim().length === 0 || !todos || todos.length === 0) {
      handleSetPopoverMapIdToTitleModificationNotValid(id, true, false);
      return;
    }

    const allLists = await db.todo.toArray();
    for (const current of allLists) {
      if (current.title.trim().localeCompare(title.trim()) == 0) {
        handleSetPopoverMapIdToTitleModificationNotValid(id, false, true);
        return;
      }
    }

    for (const current of todos) {
      if (current.id === id) {
        await db.todo.where("id").equals(id).modify({ title: title.trim() });
        break;
      }
    }
  }

  async function deleteList(id: number) {
    await db.todo.where("id").equals(id).delete();
  }

  return (
    <thead key={todo.id} className="containerDisplay header">
      <tr>
        <PopoverMapHoverListIsExpandedStatusDisplay
          todo={todo}
          mapHoverListIsExpandedStatusDisplay={
            mapHoverListIsExpandedStatusDisplay
          }
          handleSetMapIdToListIsExpanded={handleSetMapIdToListIsExpanded}
          mapIdToListIsExpanded={mapIdToListIsExpanded}
          handleSetMapHoverListIsExpandedStatusDisplay={
            handleSetMapHoverListIsExpandedStatusDisplay
          }
        />
        <th className="tableHeadTodoListNo">{indexList + 1}</th>
        <th className="tableHeadTodoListID">ID {todo.id} </th>
        <PopoverEditTitleOrDisplayExistingTitle
          todo={todo}
          popoverMapIdToTitleModificationNotValid={
            popoverMapIdToTitleModificationNotValid
          }
          mapIdToIsEditingTitle={mapIdToIsEditingTitle}
          mapIdToListEditedTitle={mapIdToListEditedTitle}
          handleSetMapIdToListTitle={handleSetMapIdToListTitle}
          editTitleList={editTitleList}
          handleSetMapIdToIsEditingTitle={handleSetMapIdToIsEditingTitle}
        />
        <th>
          completed
          <br />
          {getRatioNumberOfCompletedTasksToAllTasks(todo)}
        </th>
        <th className="tableHeadEditTitleTodoListButton">
          <button
            className="button"
            onClick={() => handleSetMapIdToIsEditingTitle(todo.id, true)}
          >
            edit title
          </button>
        </th>
        <th className="tableHeadDeleteTodoListButton">
          <button className="button" onClick={() => deleteList(todo.id)}>
            delete list
          </button>
        </th>
      </tr>
    </thead>
  );
}
