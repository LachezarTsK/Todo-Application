import type { TODO } from "../../../util/dataStructures";

import { VscFoldDown, VscFoldUp } from "react-icons/vsc";
import { Popover } from "react-tiny-popover";

interface PopoverMapHoverListIsExpandedStatusDisplayProps {
  todo: TODO;
  mapHoverListIsExpandedStatusDisplay: Map<number, boolean>;
  handleSetMapIdToListIsExpanded: (id: number) => void;
  mapIdToListIsExpanded: Map<number, boolean>;
  handleSetMapHoverListIsExpandedStatusDisplay: (
    id: number,
    isDisplayed: boolean,
  ) => void;
}

export default function PopoverMapHoverListIsExpandedStatusDisplay({
  todo,
  mapHoverListIsExpandedStatusDisplay,
  handleSetMapIdToListIsExpanded,
  mapIdToListIsExpanded,
  handleSetMapHoverListIsExpandedStatusDisplay,
}: PopoverMapHoverListIsExpandedStatusDisplayProps) {
  return (
    <Popover
      isOpen={mapHoverListIsExpandedStatusDisplay.get(todo.id) || false}
      content={
        <div className="popover information">
          {mapIdToListIsExpanded.get(todo.id) ? (
            <>click to fold list </>
          ) : (
            <>click to expand list</>
          )}
        </div>
      }
      positions={["bottom", "right"]}
    >
      <th
        onClick={() => handleSetMapIdToListIsExpanded(todo.id)}
        onMouseEnter={() =>
          handleSetMapHoverListIsExpandedStatusDisplay(todo.id, true)
        }
        onMouseLeave={() =>
          handleSetMapHoverListIsExpandedStatusDisplay(todo.id, false)
        }
      >
        {mapIdToListIsExpanded.get(todo.id) ? (
          <VscFoldUp className="tableHeadExpandCollapseTodoList" />
        ) : (
          <VscFoldDown className="tableHeadExpandCollapseTodoList" />
        )}
      </th>
    </Popover>
  );
}
