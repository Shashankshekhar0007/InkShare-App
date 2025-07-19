import { createContext } from "react";

const boardContext = createContext({
  activetoolItem: "",
  elements: [],
  toolActionType: "",
  changeToolHandler: () => { },
  boardMouseDownHandler: () => { },
  boardMouseMoveHandler: () => { },
  boardMouseUpHandler: () => { },
});
export default boardContext;
