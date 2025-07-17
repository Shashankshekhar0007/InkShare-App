import Board from "./components/Board/index";
import Toolbox from "./components/Toolbox/index";
import BoardProvider from "./store/BoardProvider";
function App() {
  return (
    <BoardProvider>
      <Toolbox />
      <Board />
    </BoardProvider>
  );
}

export default App;
