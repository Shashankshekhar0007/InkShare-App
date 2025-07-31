import { useContext, useEffect, useRef, useLayoutEffect } from "react";
import rough from "roughjs";
import boardContext from "../../store/boardContext";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import { getSvgPathFromStroke } from "../../utils/elements";
import getStroke from "perfect-freehand";
import classes from "./index.module.css";
function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const { elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    toolActionType,
    textAreaBlurHandler,
    undo,
    redo, } = useContext(boardContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const { toolboxState } = useContext(toolboxContext);
  const handleMouseUp = () => {
    boardMouseUpHandler();
  };
  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    const roughCanvas = rough.canvas(canvas);
    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          const path = new Path2D(getSvgPathFromStroke(getStroke(element.points)));
          context.fill(path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "z" && event.ctrlKey) {
        undo();
      }
      else if (event.key === "y" && event.ctrlKey) {
        redo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [undo, redo]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);
  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };


  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (<textarea
        type="text"
        ref={textAreaRef}
        className={classes.textElementBox}
        style={{
          top: elements[elements.length - 1].y1,
          left: elements[elements.length - 1].x1,
          fontSize: `${elements[elements.length - 1]?.size}px`,
          color: elements[elements.length - 1]?.stroke,
        }}
        onBlur={(event) => textAreaBlurHandler(event.target.value, toolboxState)}
      />)}
      <canvas ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
