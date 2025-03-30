import { FC } from "react";
import { CountryContextBar } from "../features/country-selection/CountryContextBar";
import { useSelectedGlobeCountryId } from "../features/country-selection/useGlobeSelectedCountryId";

export const OverlayLayout: FC = () => {
	const [countryId] = useSelectedGlobeCountryId();
	return <div>{countryId && <CountryContextBar countryId={countryId} />}</div>;
};
