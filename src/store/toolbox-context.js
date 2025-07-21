import { createContext } from "react";
// import { COLORS } from "../constants";

const toolboxContext = createContext({
  toolboxState: {},
  changestroke: () => { },
  changefill: () => { },
  changeSize: () => { },
});

export default toolboxContext;