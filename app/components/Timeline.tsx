import React, { useState } from "react";
import { ids } from "../page";

const Timeline = () => {
  const [maximalize, setMaximalize] = useState(false);

  if (maximalize) {
    return (
      <div className="h-min bg-gray-200">
        <div className="flex h-full justify-between pl-5 text-black">
          <div>
            Objects:
            {ids.map(id => {
              return <p>{id.type}</p>;
            })}
          </div>

          <button className="btn" onClick={() => setMaximalize(max => false)}>
            Hide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-12 bg-gray-950 py-1">
      <div className="flex grow justify-between pl-5 text-whote items-center h-full">
        Timeline
        <button className="btn btn-sm" onClick={() => setMaximalize(max => true)}>
          Show
        </button>
      </div>
    </div>
  );
};

export default Timeline;
