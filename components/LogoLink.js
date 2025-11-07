"use client";
import React from "react";

export default function LogoLink() {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <img
        src="/sportitupp-removebg-preview.png"
        alt="SportItUp"
        className="h-20 cursor-pointer"
      />
    </a>
  );
}
