import van from "vanjs-core";
import { ErrorBubble } from "./ErrorBubble";

const { div } = van.tags;

export const PageError = (error: string) =>
	div({ class: "screen" }, div({ class: "screen-box" }, ErrorBubble(error)));
