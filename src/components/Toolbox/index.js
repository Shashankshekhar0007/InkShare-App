import React, { useContext, useState } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import { FaSlash } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import boardContext from "../../store/boardContext";
const Toolbox = () => {
  const { activetoolItem, handletoolClick } = useContext(boardContext);

  return <div className={classes.container}>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === 'Line' })} onClick={() => { handletoolClick('Line') }}><FaSlash /></div>
    <div className={cx(classes.toolItem, { [classes.active]: activetoolItem === 'rectangle' })} onClick={() => { handletoolClick('rectangle') }}><LuRectangleHorizontal /></div>
  </div>;
};

export default Toolbox;
