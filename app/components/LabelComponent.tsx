"use client";

import React from "react";
import { sync } from "../page";

export var labelHistory : any[][] = [];

export const createLabelHandler = (root:any) => {
  const id = root.register("Label");

  labelHistory[id] = [];

  console.log("Label Created: ", id)


  return {
    set: (data : any, synhronize = true) => {
      labelHistory[id].push(data);
  
      if (synhronize) {
        sync(id)
      }
    }
  }

}

export var resetLabel = () => {
  labelHistory = [];
}

const LabelComponent = ({content} : {content: any}) => {
  return (
    <p className="text-3xl">{content}</p>
  )
}


export default LabelComponent;
