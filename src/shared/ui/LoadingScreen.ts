import van from "vanjs-core";
import { LoaderSpinner } from "./LoaderSpinner";

const { div, span } = van.tags;

export const LoadingScreen = () =>
	div(
		{ class: "screen" },
		div({ class: "screen-box" }, LoaderSpinner(), span({ class: "muted" }, "Loading..."))
	);
