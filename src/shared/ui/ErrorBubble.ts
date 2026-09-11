import van from "vanjs-core";

const { div, span } = van.tags;

export const ErrorBubble = (error: string) => div({ class: "error-bubble" }, span(error));
