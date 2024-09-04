"use client";

import React from "react";
import { sync } from "../page";

export var labelHistory : any[][] = [];

export const createLabelHandler = (root:any, metadata:any) => {
  const id = root.register("Label", metadata);

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

const LabelComponent = ({content, metadata} : {content: any, metadata: any}) => {
  return (
    <p className="text-3xl">{content}</p>
  )
}


export default LabelComponent;
