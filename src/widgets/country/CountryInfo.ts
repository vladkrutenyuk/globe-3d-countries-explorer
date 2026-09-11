import van, { type ChildDom } from "vanjs-core";
import { countryDataState } from "@/features/rest-countries-data/countryData";
import { ErrorBubble } from "@/shared/ui/ErrorBubble";

const { a, code, div, h2, h3, hr, img, p, span } = van.tags;

const LABELS = [
	"Flag",
	"Capital",
	"Area",
	"Population",
	"Region",
	"Subregion",
	"Domain zones",
	"Currencies",
];

export const CountryInfo = (countryId: string) => {
	const { data, error } = countryDataState(countryId);

	return div(() => {
		if (error.val) return ErrorBubble(error.val.message);

		const country = data.val;
		if (!country) {
			return div(
				LABELS.map((label, i) =>
					Field(label, div({ class: i === 0 ? "skeleton skeleton-flag" : "skeleton skeleton-line" }))
				)
			);
		}

		const { name, capital, capitalInfo, currencies, maps } = country;

		return div(
			h2({ class: "info-title" }, name.common),
			name.official !== name.common ? p({ class: "info-subtitle" }, name.official) : "",
			hr({ class: "info-divider" }),

			Field("Flag", img({ width: 100, src: country.flags.png, alt: country.flags.alt })),
			Field(
				"Capital",
				span(capital[0] ?? "—"),
				" ",
				capitalInfo.latlng.length ? Code(capitalInfo.latlng.join(", ")) : ""
			),
			Field("Area", `${country.area} km²`),
			Field("Population", country.population),
			Field("Region", country.region),
			Field("Subregion", country.subregion ?? ""),
			Field("Domain zones", div({ class: "info-list" }, country.tld.map(Code))),
			Field(
				"Currencies",
				Object.entries(currencies).map(([key, currency]) =>
					div([key, currency.name, currency.symbol].filter(Boolean).join(", "))
				)
			),

			div(
				{ class: "info-links" },
				a({ class: "btn btn-outline", href: maps.googleMaps, target: "_blank" }, "Google Maps"),
				a({ class: "btn btn-outline", href: maps.openStreetMaps, target: "_blank" }, "OpenStreetMap")
			)
		);
	});
};

const Field = (label: string, ...content: ChildDom[]) => [
	h3({ class: "info-label" }, label),
	div({ class: "info-content" }, ...content),
];

const Code = (text: string) => code({ class: "info-code" }, text);
