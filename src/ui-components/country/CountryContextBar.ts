import van from "vanjs-core";
import { createElement, Sparkle, SquareMenu } from "lucide";
import { storeState } from "@/shared/lib/storeState";
import { $selectedCountry, $selectedCountryId } from "@/stores";
import { ErrorBubble } from "../common/ErrorBubble";

const { button, div, span, strong } = van.tags;

export const CountryContextBar = (openInfo: () => void) => {
	const countryId = storeState($selectedCountryId);
	const country = storeState($selectedCountry);

	return div({ class: "country-bar" }, () => {
		const id = countryId.val;
		if (!id) {
			return div(
				{ class: "top-bar-hint" },
				createElement(Sparkle),
				span("Click globe to select country")
			);
		}

		const data = country.val;
		if (!data) return ErrorBubble(`No data for ${id}`);

		return div(
			{ class: "country-bar-row" },
			span({ class: "country-bar-flag" }, data.flag),
			strong({ class: "country-bar-name" }, data.name.common),
			button(
				{ class: "btn btn-secondary", onclick: openInfo },
				createElement(SquareMenu),
				"Info"
			)
		);
	});
};
