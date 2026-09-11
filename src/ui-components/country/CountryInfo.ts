import van, { type ChildDom } from "vanjs-core";
import { storeState } from "@/shared/lib/storeState";
import { $selectedCountry } from "@/stores";

const { a, code, div, h2, h3, hr, img, p, span } = van.tags;

export const CountryInfo = () => {
	const country = storeState($selectedCountry);

	return div(() => {
		const data = country.val;
		if (!data) return div();

		const { name, capital, capitalInfo, currencies, maps } = data;

		return div(
			h2({ class: "info-title" }, name.common),
			name.official !== name.common
				? p({ class: "info-subtitle" }, name.official)
				: "",
			hr({ class: "info-divider" }),

			Field("Flag", img({ width: 100, src: data.flags.png, alt: data.flags.alt })),
			Field(
				"Capital",
				span(capital[0] ?? "—"),
				" ",
				capitalInfo.latlng.length ? Code(capitalInfo.latlng.join(", ")) : ""
			),
			Field("Area", `${data.area} km²`),
			Field("Population", data.population),
			Field("Region", data.region),
			Field("Subregion", data.subregion ?? ""),
			Field("Domain zones", div({ class: "info-list" }, data.tld.map(Code))),
			Field(
				"Currencies",
				Object.entries(currencies).map(([key, currency]) =>
					div([key, currency.name, currency.symbol].filter(Boolean).join(", "))
				)
			),

			div(
				{ class: "info-links" },
				a(
					{ class: "btn btn-outline", href: maps.googleMaps, target: "_blank" },
					"Google Maps"
				),
				a(
					{
						class: "btn btn-outline",
						href: maps.openStreetMaps,
						target: "_blank",
					},
					"OpenStreetMap"
				)
			)
		);
	});
};

const Field = (label: string, ...content: ChildDom[]) => [
	h3({ class: "info-label" }, label),
	div({ class: "info-content" }, ...content),
];

const Code = (text: string) => code({ class: "info-code" }, text);
