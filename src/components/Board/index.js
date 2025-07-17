import { useContext, useEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/boardContext";


function Board() {
  const canvasRef = useRef();
  const { elements } = useContext(boardContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const handleMouseDown = (event) => {
    const clientx = event.clientX;
    const clienty = event.clientY;
    console.log(clientx, clienty);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);
    const generator = roughCanvas.generator;
    let rect1 = generator.rectangle(100, 100, 200, 100);
    roughCanvas.draw(rect1);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} onMouseDown={handleMouseDown} />
    </>
  );
}

export default Board;
