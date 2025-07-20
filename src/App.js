import Board from "./components/Board/index";
import Toolbar from "./components/Toolbar/index";
import Toolbox from "./components/Toolbox/index";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";


function App() {
  return (
    <BoardProvider>
      <ToolboxProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}

export default App;
