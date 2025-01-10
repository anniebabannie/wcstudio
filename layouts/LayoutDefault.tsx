import "./style.css";

import "./tailwind.css";

import React from "react";
import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link.js";
import { PageContextProvider } from "vike-react/usePageContext";


export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex max-w-5xl m-auto"}>
      <h1>LayoutDefault</h1>
      {children}
    </div>
  );
}
