import Board from "./components/Board/index";
import Toolbar from "./components/Toolbar/index";
import BoardProvider from "./store/BoardProvider";
function App() {
  return (
    <BoardProvider>
      <Toolbar />
      <Board />
    </BoardProvider>
  );
}

export default App;
