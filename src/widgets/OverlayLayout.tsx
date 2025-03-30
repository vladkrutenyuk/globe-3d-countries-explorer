import { FC } from "react";
import { CountryContextBar } from "./country/CountryContextBar";
import { useSelectedGlobeCountryId } from "../features/country-selection/useGlobeSelectedCountryId";
import { TopBar } from "@/shared/ui/TopBar";
import { Sparkle } from "lucide-react";
import { ThemeSwitchButton } from "./ThemeSwitchButton";

export const OverlayLayout: FC = () => {
	const [countryId] = useSelectedGlobeCountryId();

	return (
		<>
			<TopBar className="fixed left-1/2 -translate-x-1/2 bottom-4 md:bottom-auto md:top-4 min-h-12">
				{countryId ? (
					<CountryContextBar countryId={countryId} />
				) : (
					<div className="text-foreground-muted w-full opacity-50 text-center flex items-center justify-center space-x-2">
						<Sparkle className="w-4 h-4" />
						<span>Click globe to select country</span>
					</div>
				)}
			</TopBar>
			<ThemeSwitchButton className="fixed top-4 right-4"/>
		</>
	);
};
