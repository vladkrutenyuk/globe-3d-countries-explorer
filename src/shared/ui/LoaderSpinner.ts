import van from "vanjs-core";
import { createElement, LoaderCircle } from "lucide";

const { div } = van.tags;

export const LoaderSpinner = () => div({ class: "spinner" }, createElement(LoaderCircle));
