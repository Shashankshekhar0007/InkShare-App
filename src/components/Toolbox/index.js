import React, { useContext } from "react";
import classes from "./index.module.css";
import { COLORS, FILL_TOOL_TYPES, SIZE_TOOL_TYPES, STROKE_TOOL_TYPES, TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/boardContext";
import toolboxContext from "../../store/toolbox-context";
import cx from "classnames";
const Toolbox = () => {
  const { activetoolItem } = useContext(boardContext);
  const { toolboxState, changestroke, changefill, changeSize } = useContext(toolboxContext);
  const strokecolor = toolboxState[activetoolItem]?.stroke;
  const fillcolor = toolboxState[activetoolItem]?.fill;
  const size = toolboxState[activetoolItem]?.size;
  return (
    <div className={classes.container}>
      {STROKE_TOOL_TYPES.includes(activetoolItem) && <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Stroke Color</div>
        <div className={classes.colorOption} >
          {
            Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={k}
                  className={cx(classes.colorBox, { [classes.activeColorBox]: strokecolor === COLORS[k] })} style={{ backgroundColor: COLORS[k] }} onClick={() => { changestroke(activetoolItem, COLORS[k]) }}>
                </div>
              );
            })}
        </div>
      </div>}
      {FILL_TOOL_TYPES.includes(activetoolItem) && <div className={classes.selectOptionContainer}>
        <div className={classes.toolBoxLabel}>Fill Color</div>
        <div className={classes.colorOption} >
          {
            Object.keys(COLORS).map((k) => {
              return (
                <div
                  className={cx(classes.colorBox, { [classes.activeColorBox]: fillcolor === COLORS[k] })} style={{ backgroundColor: COLORS[k] }} onClick={() => { changefill(activetoolItem, COLORS[k]) }}>
                </div>
              );
            })}
        </div>
      </div>}
      {SIZE_TOOL_TYPES.includes(activetoolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>
            {activetoolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </div>
          <input
            type="range"
            min={activetoolItem === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activetoolItem === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={(event) => changeSize(activetoolItem, event.target.value)}
          ></input>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
