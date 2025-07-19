import React, { useReducer, useState } from "react";
import boardContext from "./boardContext";
import { TOOL_ITEMS, BOARD_ACTIONS, TOOL_ACTION_TYPES } from "../constants";
import { createRoughElement } from "../utils/elements";
const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: return {
      ...state,
      activetoolItem: action.payload.tool,
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      const { clientX, clientY } = action.payload;
      const newelement = createRoughElement(state.elements.length, clientX, clientY, clientX, clientY, { type: state.activetoolItem });
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.DRAWING,
        elements: [...state.elements, newelement],
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements];
      const index = state.elements.length - 1;
      const { x1, y1 } = newElements[index];
      const newElement = createRoughElement(index, x1, y1, clientX, clientY, { type: state.activetoolItem });
      newElements[index] = newElement;
      return {
        ...state,
        elements: newElements,
      };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    default: return state;
  }
}
const initialboardstate = {
  toolActionType: TOOL_ACTION_TYPES.NONE,
  activetoolItem: TOOL_ITEMS.LINE,
  elements: [],
}
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialboardstate);

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      }
    })
  };
  const boardMouseDownHandler = (event) => {
    const { clientX, clientY } = event;
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
      }
    })
  };
  const boardMouseUpHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    })
  };
  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_MOVE,
      payload: {
        clientX,
        clientY,
      }
    })
  };

  const boardContextValue = {
    activetoolItem: boardState.activetoolItem,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
  }

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
