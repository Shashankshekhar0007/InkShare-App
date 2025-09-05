import React, { useCallback, useReducer, useEffect } from "react";
import boardContext from "./boardContext";
import { TOOL_ITEMS, BOARD_ACTIONS, TOOL_ACTION_TYPES } from "../constants";
import {
  createRoughElement,
  getSvgPathFromStroke, PointNearElement
} from "../utils/elements";

import getStroke from "perfect-freehand";

import { updateCanvas, fetchInitialCanvasElements } from "../utils/api";

const canvasId = "67a66a7c2475972d34655e4d";
const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: return {
      ...state,
      activetoolItem: action.payload.tool,
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newelement = createRoughElement(state.elements.length, clientX, clientY, clientX, clientY,
        { type: state.activetoolItem, stroke, fill, size });
      return {
        ...state,
        toolActionType: state.activetoolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
        elements: [...state.elements, newelement],
      };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE: {
      return {
        ...state,
        toolActionType: action.payload.actionType,
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements];
      const index = state.elements.length - 1;
      const { type } = newElements[index];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          const { x1, y1, stroke, fill, size } = newElements[index];
          const newElement = createRoughElement(index, x1, y1, clientX, clientY, {
            type: state.activetoolItem,
            stroke,
            fill,
            size,
          });
          newElements[index] = newElement;
          return {
            ...state,
            elements: newElements,
          };
        case TOOL_ITEMS.BRUSH:
          newElements[index].points = [
            ...newElements[index].points,
            { x: clientX, y: clientY },
          ];
          newElements[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElements[index].points))
          );
          return {
            ...state,
            elements: newElements,
          };
        default:
          throw new Error("Type not recognized");
      }
    }
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.elements.length - 1;
      const newElements = [...state.elements];
      newElements[index].text = action.payload.text;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      updateCanvas(state.canvasId, newElements);
      if (state.isUserLoggedIn) {
        updateCanvas(state.canvasId, newElements);
      }
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let newElements = [...state.elements];
      newElements = newElements.filter((element) => {
        return !PointNearElement(element, clientX, clientY);
      });
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      updateCanvas(state.canvasId, newElements);
      if (state.isUserLoggedIn) {
        updateCanvas(state.canvasId, newElements);
      }

      return {
        ...state,
        elements: newElements,
        history: newHistory,
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      const elementsCopy = [...state.elements];
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(elementsCopy);
      updateCanvas(state.canvasId, elementsCopy);
      if (state.isUserLoggedIn) {
        updateCanvas(state.canvasId, elementsCopy);
      }

      return {
        ...state,
        history: newHistory,
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state;
      updateCanvas(state.canvasId, state.history[state.index - 1]);
      if (state.isUserLoggedIn) {
        updateCanvas(state.canvasId, state.history[state.index - 1]);
      }
      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }
    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;
      updateCanvas(state.canvasId, state.history[state.index + 1]);
      if (state.isUserLoggedIn) {
        updateCanvas(state.canvasId, state.history[state.index + 1]);
      }
      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
      };
    }
    case BOARD_ACTIONS.SET_INITIAL_ELEMENTS: {
      return {
        ...state,
        elements: action.payload.elements,
        history: [action.payload.elements],
      };
    }
    case BOARD_ACTIONS.SET_CANVAS_ID:
      return {
        ...state,
        canvasId: action.payload.canvasId,
      };
    case BOARD_ACTIONS.SET_CANVAS_ELEMENTS:
      return {
        ...state,
        elements: action.payload.elements,
      };

    case BOARD_ACTIONS.SET_HISTORY:
      return {
        ...state,
        history: [action.payload.elements],
      };
    case BOARD_ACTIONS.SET_USER_LOGIN_STATUS:
      return {
        ...state,
        isUserLoggedIn: action.payload.isUserLoggedIn,
      };
    default: return state;
  }
};


const isUserLoggedIn = !!localStorage.getItem("whiteboard_user_token");

const initialboardstate = {
  toolActionType: TOOL_ACTION_TYPES.NONE,
  activetoolItem: TOOL_ITEMS.LINE,
  elements: [],
  history: [[]],
  index: 0,
  canvasId: "",
  isUserLoggedIn: isUserLoggedIn,
}
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialboardstate);

  // Fetch elements from the database on component mount
  // useEffect(() => {
  //   // Move the API call to utils/api.js
  //   fetchInitialCanvasElements(boardState.canvasId)
  //     .then((elements) => {
  //       dispatchBoardAction({
  //         type: BOARD_ACTIONS.SET_INITIAL_ELEMENTS,
  //         payload: { elements },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching initial canvas elements:", error);
  //       // Optionally handle the error, e.g., set a default state or display an error message
  //     });
  // }, []); // Empty dependency array ensures this runs only once on mount

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      }
    })
  };
  const boardMouseDownHandler = (event, toolboxState) => {
    const { clientX, clientY } = event;
    if (boardState.activetoolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activetoolItem]?.stroke,
        fill: toolboxState[boardState.activetoolItem]?.fill,
        size: toolboxState[boardState.activetoolItem]?.size,
      }
    })
  };
  const textAreaBlurHandler = (text, toolboxState) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
  };

  const boardMouseUpHandler = () => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      });
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      }
    })
  };
  const boardMouseMoveHandler = (event) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        }
      })
    }
    else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        }
      })

    }
  };

  const boardUndohandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
  }, []);

  const boardRedohandler = useCallback(() => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
  }, []);

  const setUserLoginStatus = (isUserLoggedIn) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_USER_LOGIN_STATUS,
      payload: {
        isUserLoggedIn,
      },
    })
  }
  const setCanvasId = (canvasId) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_CANVAS_ID,
      payload: {
        canvasId,
      },
    });
  };

  const setElements = (elements) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_CANVAS_ELEMENTS,
      payload: {
        elements,
      },
    });
  };
  // console.log("hello canvas")
  const setHistory = (elements) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.SET_HISTORY,
      payload: {
        elements,
      },
    });
  };


  const boardContextValue = {
    activetoolItem: boardState.activetoolItem,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndohandler,
    redo: boardRedohandler,
    setUserLoginStatus,
    canvasId: boardState.canvasId,
    isUserLoggedIn: boardState.isUserLoggedIn,
    setCanvasId,
    setElements,
    setHistory,
  }
  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
