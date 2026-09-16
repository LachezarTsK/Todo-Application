import { Popover } from "react-tiny-popover";

import "../../../styles/database.css";
import "../../../styles/displayTodo.css";

interface PopoverDisplaySearchInstructionsProps {
  popoverDisplaySearchInstructions: boolean;
  setPopoverDisplaySearchinstructions: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  searchEntry: string;
  setSearchEntry: React.Dispatch<React.SetStateAction<string>>;
}

export default function PopoverDisplaySearchInstructions({
  popoverDisplaySearchInstructions,
  setPopoverDisplaySearchinstructions,
  searchEntry,
  setSearchEntry,
}: PopoverDisplaySearchInstructionsProps) {
  return (
    <Popover
      isOpen={popoverDisplaySearchInstructions}
      content={
        <div className="popover information">
          <>
            to initiate serach: <br />
            select search criteria and type search entry
          </>
        </div>
      }
      positions={["bottom", "right"]}
    >
      <div
        onMouseEnter={() => setPopoverDisplaySearchinstructions(true)}
        onMouseLeave={() => setPopoverDisplaySearchinstructions(false)}
      >
        <input
          className="input topPanel"
          type="text"
          placeholder="enter search target"
          value={searchEntry}
          onChange={(e) => setSearchEntry(e.target.value)}
        />{" "}
      </div>
    </Popover>
  );
}
