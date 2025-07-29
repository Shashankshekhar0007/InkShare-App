import { createContext } from "react";

const boardContext = createContext({
  activetoolItem: "",
  elements: [],
  toolActionType: "",
  history: [[]],
  index: 0,
  changeToolHandler: () => { },
  boardMouseDownHandler: () => { },
  boardMouseMoveHandler: () => { },
  boardMouseUpHandler: () => { },
});
export default boardContext;
