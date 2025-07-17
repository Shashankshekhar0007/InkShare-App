import React, { useReducer, useState } from "react";
import boardContext from "./boardContext";
import { TOOL_ITEMS, } from "../constants";
const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_TOOL": return {
      ...state,
      activetoolItem: action.payload.tool,
    }
    default: return { state }
  }
}
const initialboardstate = {
  activetoolItem: TOOL_ITEMS.LINE,
  elements: [],
}
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialboardstate);
  // const [activetoolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);

  const handletoolClick = (tool) => {
    dispatchBoardAction({
      type: "CHANGE_TOOL",
      payload: {
        tool,
      }
    })
  };

  const boardContextValue = {
    activetoolItem: boardState.activetoolItem,
    elements: boardState.elements,
    handletoolClick,
  }

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
