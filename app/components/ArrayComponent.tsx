"use client";

import React, { useEffect, useImperativeHandle, useState } from "react";

const Box = ({
  data,
  active,
  secoundaryActive,
}: {
  data: any;
  active: boolean;
  secoundaryActive: boolean;
}) => {
  let bgColor = active ? "bg-sky-900" : "bg-stone-900";
  if (secoundaryActive) {
    bgColor = "bg-orange-800";
  }

  return (
    <div
      className={`w-20 h-20 text-3xl flex items-center justify-center border-4 border-gray-950 ${bgColor} text-white`}
    >
      <span>{data}</span>
    </div>
  );
};

const ArrayComponent = React.forwardRef(
  (
    {
      data,
      start,
    }: {
      data: any[];
      start: number;
    },
    ref: any
  ) => {
    const [activeIndex, setActiveIndex] = useState(start);
    const [arr, setArr] = useState(data);
    const [secoundaryActive, setSecondaryActive] = useState<number[]>([]);

    const setArray = (i: number, val: any) => {
      setArr((prev: any) => {
        return prev.map((e: any, index: number) => {
          if (i == index) {
            return val;
          }

          return e;
        });
      });
    };

    useImperativeHandle(ref, () => ({
      exec: (code: string) => {
        eval(code);
      },
    }));

    return (
      <div>
        <div className="flex gap-1">
          {arr.map((item, index) => (
            <Box
              key={index}
              data={item}
              active={index === activeIndex}
              secoundaryActive={secoundaryActive.includes(index)}
            />
          ))}
        </div>
        <button
          className="btn btn-accent"
          onClick={() => console.log("next step")}
        >
          {" "}
          Next
        </button>
      </div>
    );
  }
);

export default ArrayComponent;
