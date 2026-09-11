import van from "vanjs-core";
import { createElement, SquareMenu } from "lucide";
import { countryDataState } from "@/features/rest-countries-data/countryData";
import { ErrorBubble } from "@/shared/ui/ErrorBubble";
import { LoaderSpinner } from "@/shared/ui/LoaderSpinner";

const { button, div, span, strong } = van.tags;

export const CountryContextBar = (countryId: string, openInfo: () => void) => {
	const { data, error } = countryDataState(countryId);

	return div({ class: "country-bar" }, () => {
		if (error.val) return ErrorBubble(error.val.message);

		const country = data.val;
		return div(
			{ class: "country-bar-row" },
			country ? span({ class: "country-bar-flag" }, country.flag) : LoaderSpinner(),
			country
				? strong({ class: "country-bar-name" }, country.name.common)
				: span({ class: "country-bar-name muted" }, countryId),
			button(
				{ class: "btn btn-secondary", disabled: !country, onclick: openInfo },
				createElement(SquareMenu),
				"Info"
			)
		);
	});
};
