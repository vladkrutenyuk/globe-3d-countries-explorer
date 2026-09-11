import van from "vanjs-core";
import type { Globe } from "@/core/components/Globe";

/** Reactive mirror of the globe's selected country id */
export const createSelectedCountryState = (globe: Globe) => {
	const selected = van.state(globe.getSelectedCountry());
	globe.on("selection", (id) => {
		selected.val = id;
	});
	return selected;
};
