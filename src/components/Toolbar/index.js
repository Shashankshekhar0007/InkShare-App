import React, { useContext } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaFont,
  FaUndoAlt,
  FaRedoAlt,
  FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import boardContext from "../../store/boardContext";
import { TOOL_ITEMS } from "../../constants";
const Toolbar = () => {
  const { activetoolItem, changeToolHandler, undo, redo } = useContext(boardContext);
  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = data;
    link.download = "InkShare.png";
    link.click();
  }
  return <div className={classes.container}>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.BRUSH })} onClick={() => { changeToolHandler(TOOL_ITEMS.BRUSH) }}><FaPaintBrush /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.LINE })} onClick={() => { changeToolHandler(TOOL_ITEMS.LINE) }}><FaSlash /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.RECTANGLE })} onClick={() => { changeToolHandler(TOOL_ITEMS.RECTANGLE) }}><LuRectangleHorizontal /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.CIRCLE })} onClick={() => { changeToolHandler(TOOL_ITEMS.CIRCLE) }}><FaRegCircle /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.ARROW })} onClick={() => { changeToolHandler(TOOL_ITEMS.ARROW) }}><FaArrowRight /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.ERASER })} onClick={() => { changeToolHandler(TOOL_ITEMS.ERASER) }}><FaEraser /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === TOOL_ITEMS.TEXT })} onClick={() => { changeToolHandler(TOOL_ITEMS.TEXT) }}><FaFont /></div>
    <div className={classes.toolItem} onClick={() => { undo() }}><FaUndoAlt /></div>
    <div className={classes.toolItem} onClick={() => { redo() }}><FaRedoAlt /></div>
    <div className={classes.toolItem} onClick={handleDownloadClick}><FaDownload /></div>
  </div>;
};

export default Toolbar;
