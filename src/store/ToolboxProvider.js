import React, { useReducer } from "react";
import toolboxContext from "./toolbox-context";
import { TOOL_ITEMS, COLORS, TOOLBOX_ACTIONS } from "../constants";

function toolboxReducer(state, action) {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE: {
      const newstate = { ...state };
      newstate[action.payload.tool].stroke = action.payload.stroke;
      return newstate;
    }
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      const newState = { ...state };
      newState[action.payload.tool].fill = action.payload.fill;
      return newState;
    }
    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      const newState = { ...state };
      newState[action.payload.tool].size = action.payload.size;
      return newState;
    }
    default:
      return state;
  }
}
const initialtoolboxState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    size: 1,
    fill: null,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    size: 1,
    fill: null,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    // size: 1,s
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 24,
  }
}

const ToolboxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialtoolboxState);

  const changestrokeHandler = (tool, stroke) => {

    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: {
        tool,
        stroke,
      }
    })
  }
  const changefillHandler = (tool, fill) => {

    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: {
        tool,
        fill,
      }
    })
  }
  const changeSizeHandler = (tool, size) => {

    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: {
        tool,
        size,
      }
    })
  }

  const toolboxContextValue = {
    toolboxState,
    changestroke: changestrokeHandler,
    changefill: changefillHandler,
    changeSize: changeSizeHandler,
  };
  return <toolboxContext.Provider value={toolboxContextValue}>{children}</toolboxContext.Provider>;
};

export default ToolboxProvider;
