import van, { type ChildDom } from "vanjs-core";

const { div } = van.tags;

export const TopBar = (...children: ChildDom[]) => div({ class: "top-bar" }, ...children);
