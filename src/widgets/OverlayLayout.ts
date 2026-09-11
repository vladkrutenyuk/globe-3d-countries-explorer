import van from "vanjs-core";
import { createElement, Sparkle } from "lucide";
import type { AppCore } from "@/core/AppCore";
import { createSelectedCountryState } from "@/features/country-selection/selectedCountry";
import { TopBar } from "@/shared/ui/TopBar";
import { CountryContextBar } from "./country/CountryContextBar";
import { CountryInfoPanel } from "./country/CountryInfoPanel";
import { ThemeSwitchButton } from "./ThemeSwitchButton";

const { div, span } = van.tags;

export const OverlayLayout = (appCore: AppCore) => {
	const countryId = createSelectedCountryState(appCore.globe);
	const infoOpen = van.state(false);
	const openInfo = () => {
		infoOpen.val = true;
	};

	return [
		TopBar(() =>
			countryId.val
				? CountryContextBar(countryId.val, openInfo)
				: div(
						{ class: "top-bar-hint" },
						createElement(Sparkle),
						span("Click globe to select country")
				  )
		),
		ThemeSwitchButton(appCore),
		CountryInfoPanel(countryId, infoOpen),
	];
};
