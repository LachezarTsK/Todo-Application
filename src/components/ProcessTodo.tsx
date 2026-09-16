import { db } from "../data/db";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import TopPanel from "./topPanel/TopPanel";
import TableWrapper from "./tableTodo/TableWrapper";

export default function ProcessTodo(): React.JSX.Element {
  const [mapIdToListIsExpanded, setMapIdToListIsExpanded] = useState(
    new Map<number, boolean>(),
  );
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchEntry, setSearchEntry] = useState("");

  /*
  todos:
  
  If search criteria is selected and there is a search entry, 
  then todos contains the search results, with live update.

  Otherwise, todos contains the whole database content, again with live update.
  */
  const todos = useLiveQuery(() => db.todo.toArray())?.filter((currentTodo) =>
    searchCriteria === "list id"
      ? new RegExp(searchEntry.trim(), "i").test(
          currentTodo.id.toString().trim(),
        )
      : searchCriteria === "list title"
        ? new RegExp(searchEntry.trim(), "i").test(currentTodo.title.trim())
        : searchCriteria ===
            "ratio completed tasks, entry format: integer/integer"
          ? new RegExp(searchEntry.replaceAll(" ", ""), "i").test(
              currentTodo.todoList.isCompleted.filter((current) => current)
                .length +
                "/" +
                currentTodo.todoList.isCompleted.length,
            )
          : searchCriteria === "task description"
            ? new RegExp(searchEntry.trim(), "i").test(
                currentTodo.todoList.description.toString().trim(),
              )
            : () => db.todo.toArray(),
  );

  function handleSetMapIdToListIsExpanded(id: number) {
    const clone = new Map(mapIdToListIsExpanded);
    const isExpanded = !mapIdToListIsExpanded.get(id);
    clone.set(id, isExpanded);
    setMapIdToListIsExpanded(clone);
  }

  return (
    <div>
      <TopPanel
        handleSetMapIdToListIsExpanded={handleSetMapIdToListIsExpanded}
        searchCriteria={searchCriteria}
        searchEntry={searchEntry}
        setSearchCriteria={setSearchCriteria}
        setSearchEntry={setSearchEntry}
      />
      <TableWrapper
        todos={todos}
        handleSetMapIdToListIsExpanded={handleSetMapIdToListIsExpanded}
        mapIdToListIsExpanded={mapIdToListIsExpanded}
      />
    </div>
  );
}
