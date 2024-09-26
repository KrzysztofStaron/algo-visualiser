"use client";

import { leetcode, Problem } from "@/app/interfaces/leetcode";
import React, { useEffect, useState } from "react";
import { MdSlideshow } from "react-icons/md";

const entriesPerPage = 40;

const ProblemList = () => {
  const [page, setPage] = useState(1);
  const problems = leetcode.getProblems(page, entriesPerPage);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900">
      <div className="grow overflow-scroll">
        <ProblemDisplay problems={problems} page={page} />
      </div>
      <div className="flex justify-center">
        <PageSelection page={page} setPage={setPage} />
      </div>
    </div>
  );
};

const ProblemDisplay = ({ problems, page }: { problems: Problem[]; page: number }) => {
  return (
    <>
      {problems.map((problem, index) => {
        return (
          <div key={index} className="p-2 text-white flex justify-between" style={{ width: "400px" }}>
            <a href={problem.href} target="blank">
              <label className="font-extralight">{(page - 1) * entriesPerPage + index + 1}. </label>
              <span className="link link-hover ">{problem.text}</span>
            </a>
            <div className="self-end">
              <MdSlideshow size={28} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const PageSelection = ({ setPage, page }: { setPage: React.Dispatch<React.SetStateAction<number>>; page: number }) => {
  return (
    <div className="join">
      <button className="join-item btn btn-accent" disabled={page === 1} onClick={() => setPage(n => n - 1)}>
        «
      </button>
      <button className="join-item bg-accent text-black px-4 min-w-24">Page {page}</button>
      <button
        className={`join-item btn btn-accent`}
        disabled={page === leetcode.getNumberOfPages(entriesPerPage)}
        onClick={() => setPage(n => n + 1)}
      >
        »
      </button>
    </div>
  );
};

export default ProblemList;
