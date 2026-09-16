import type { TODO } from "../../util/dataStructures";

import TableHeader from "../tableTodo/TableHeader";
import TableBody from "../tableTodo/TableBody";
import TableFooter from "../tableTodo/TableFooter";

import "../../styles/database.css";
import "../../styles/displayTodo.css";

interface TableWrapperProps {
  todos: TODO[] | undefined;
  handleSetMapIdToListIsExpanded: (id: number) => void;
  mapIdToListIsExpanded: Map<number, boolean>;
}

export default function TableWrapper({
  todos,
  handleSetMapIdToListIsExpanded,
  mapIdToListIsExpanded,
}: TableWrapperProps) {
  return (
    <div>
      {todos && todos.length > 0
        ? todos?.map((todo, indexList) => (
            <table key={todo.id} className="container">
              <TableHeader
                todos={todos}
                todo={todo}
                indexList={indexList}
                handleSetMapIdToListIsExpanded={handleSetMapIdToListIsExpanded}
                mapIdToListIsExpanded={mapIdToListIsExpanded}
              />
              <TableBody
                todos={todos}
                todo={todo}
                mapIdToListIsExpanded={mapIdToListIsExpanded}
              />
              <TableFooter
                todos={todos}
                todo={todo}
                mapIdToListIsExpanded={mapIdToListIsExpanded}
              />
            </table>
          ))
        : null}
    </div>
  );
}
