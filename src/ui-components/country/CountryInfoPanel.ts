import van, { type State } from "vanjs-core";
import { createElement, X } from "lucide";
import { CountryInfo } from "./CountryInfo";

const { button, div } = van.tags;

/** Mounted once, `open` toggles it. Sidebar on desktop, bottom sheet on mobile (see app.css) */
export const CountryInfoPanel = (open: State<boolean>) => {
	const close = () => {
		open.val = false;
	};

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") close();
	});

	return div(
		{ class: () => (open.val ? "info open" : "info") },
		div({ class: "info-overlay", onclick: close }),
		div(
			{ class: "info-panel", role: "dialog", "aria-modal": "true" },
			button(
				{
					class: "btn btn-ghost btn-icon info-close",
					"aria-label": "Close",
					onclick: close,
				},
				createElement(X)
			),
			CountryInfo()
		)
	);
};
