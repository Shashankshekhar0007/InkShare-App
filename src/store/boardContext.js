import { createContext } from "react";

const boardContext = createContext({
  activetoolItem: "",
  elements: [],
});
export default boardContext;
