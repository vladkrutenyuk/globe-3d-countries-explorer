import van from "vanjs-core";
import { TopBar } from "./common/TopBar";
import { CountryContextBar } from "./country/CountryContextBar";
import { CountryInfoPanel } from "./country/CountryInfoPanel";
import { ThemeSwitchButton } from "./ThemeSwitchButton";

export const OverlayLayout = () => {
	const infoOpen = van.state(false);
	const openInfo = () => {
		infoOpen.val = true;
	};

	return [TopBar(CountryContextBar(openInfo)), ThemeSwitchButton(), CountryInfoPanel(infoOpen)];
};
