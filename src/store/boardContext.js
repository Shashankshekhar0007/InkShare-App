import { createContext } from "react";

const boardContext = createContext({
  isUserLoggedIn: false,
  canvasId: "",
  activetoolItem: "",
  elements: [],
  toolActionType: "",
  history: [[]],
  index: 0,
  changeToolHandler: () => { },
  boardMouseDownHandler: () => { },
  boardMouseMoveHandler: () => { },
  boardMouseUpHandler: () => { },
  setUserLoginStatus: () => { },
  setElements: () => { },
  setCanvasId: () => { },
  setHistory: () => { }
});
export default boardContext;
